'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { MoreHorizontal, BedDouble, Calendar, Check, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { AccommodationRequest } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

export function HotelDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'accommodationRequests'), where('hotelPartnerId', '==', user.id));
  }, [firestore, user]);
  const { data: requests, isLoading } = useCollection<AccommodationRequest>(requestsQuery);

  const stats = {
    pending: requests?.filter(r => r.status === 'Pending').length ?? 0,
    confirmed: requests?.filter(r => r.status === 'Confirmed').length ?? 0,
    totalRooms: requests?.reduce((acc, r) => acc + (r.rooms || 0), 0) ?? 0,
  }

  return (
    <>
      <PageHeader title="Hotel Partner Console" description="Manage accommodation requests for approved trips.">
        <Button asChild variant="outline">
            <Link href="/dashboard/hotel/properties">Manage Properties</Link>
        </Button>
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Pending Requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pending.toString()} icon={Calendar} description="Awaiting your confirmation" />
        <StatsCard title="Confirmed Stays" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.confirmed.toString()} icon={Check} description="Bookings confirmed" />
        <StatsCard title="Total Rooms (Month)" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.totalRooms.toString()} icon={BedDouble} description="Rooms requested this month" />
        <StatsCard title="Response Time" value="~2.5 hrs" icon={Clock} description="Your average response time" />
      </StatsGrid>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Recent Accommodation Requests</CardTitle>
                <CardDescription>
                    The latest requests linked to confirmed charter flights or empty legs.
                </CardDescription>
            </div>
            <Button asChild variant="outline">
                <Link href="/dashboard/hotel/requests">View All</Link>
            </Button>
        </CardHeader>
        <CardContent>
           {isLoading ? <Skeleton className="h-40 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Guest Type</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests?.slice(0,5).map((req) => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                        <TableCell className="font-code">{req.charterRequestId || req.emptyLegFlightId}</TableCell>
                        <TableCell>
                            <Badge variant={req.isCrewAccommodation ? 'outline' : 'secondary'}>{req.isCrewAccommodation ? 'Crew' : 'Passenger'}</Badge>
                        </TableCell>
                        <TableCell>{req.checkInDate}</TableCell>
                        <TableCell>
                            <Badge variant={req.status === 'Pending' ? 'destructive' : req.status === 'Confirmed' ? 'default' : 'secondary'}>{req.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {req.status === 'Pending' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Accept</DropdownMenuItem>
                                        <DropdownMenuItem disabled>Propose Alternate</DropdownMenuItem>
                                        <DropdownMenuItem>Decline (with reason)</DropdownMenuItem>
                                    </>
                                )}
                                {req.status === 'Confirmed' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Upload Voucher</DropdownMenuItem>
                                    </>
                                )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
        </CardContent>
      </Card>
    </>
  );
}
