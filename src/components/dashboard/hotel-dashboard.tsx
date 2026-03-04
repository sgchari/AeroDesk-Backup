
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, BedDouble, Calendar, Check, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import Link from "next/link";
import { AccommodationRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";

export function HotelDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(
        collection(firestore, 'accommodationRequests'), 
        where('hotelPartnerId', '==', user.id),
        limit(5)
    );
  }, [firestore, user]);
  const { data: requests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(requestsQuery, 'accommodationRequests');

  const isLoading = isUserLoading || requestsLoading;

  const stats = {
    pending: requests?.filter(r => r.status === 'Pending').length ?? 0,
    upcomingCheckIns: requests?.filter(r => r.status === 'Confirmed' && new Date(r.checkIn) > new Date()).length ?? 0,
    activeOccupancy: requests?.filter(r => r.status === 'Confirmed' && new Date(r.checkIn) <= new Date() && new Date(r.checkOut) > new Date()).reduce((acc, r) => acc + r.rooms, 0) ?? 0,
    availabilityAlerts: 0, 
  }

  return (
    <>
      <PageHeader title="Hotel Partner Console" description="Manage accommodation requests for approved trips.">
        <Button asChild variant="outline">
            <Link href="/dashboard/hotel/properties">Manage Properties</Link>
        </Button>
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Pending Stay Requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pending.toString()} icon={Clock} description="Awaiting your confirmation" />
        <StatsCard title="Upcoming Check-Ins" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.upcomingCheckIns.toString()} icon={Calendar} description="In the next 7 days" />
        <StatsCard title="Active Occupancy" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeOccupancy.toString()} icon={BedDouble} description="Rooms via AeroDesk" />
        <StatsCard title="Availability Alerts" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.availabilityAlerts.toString()} icon={AlertTriangle} description="Potential conflicts" />
      </StatsGrid>

      <Card className="bg-card">
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
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests?.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                        <TableCell>{req.guestName || 'N/A'}</TableCell>
                        <TableCell>{req.propertyName}</TableCell>
                        <TableCell>{new Date(req.checkIn).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant={req.status === 'Pending' ? 'warning' : req.status === 'Confirmed' ? 'success' : 'secondary'}>{req.status}</Badge>
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
                                        <DropdownMenuItem>Accept Request</DropdownMenuItem>
                                        <DropdownMenuItem>Decline Request</DropdownMenuItem>
                                        <DropdownMenuItem>Send Message / Query</DropdownMenuItem>
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
           {(!isLoading && (!requests || requests.length === 0)) && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No recent accommodation requests found.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}
