
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AccommodationRequest } from "@/lib/types";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


export default function HotelRequestsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        // This assumes the hotel partner's user ID is their hotelPartnerId.
        // A more robust solution might involve a profile lookup.
        return query(collection(firestore, 'accommodationRequests'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);
    const { data: accommodationRequests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(requestsQuery);

    const isLoading = isUserLoading || requestsLoading;

  return (
    <>
      <PageHeader title="Accommodation Requests" description="Manage all incoming accommodation requests for your properties." />
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>
            Requests linked to confirmed charter flights or empty legs.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Guest Type</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {accommodationRequests?.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                        <TableCell className="font-code">{req.tripReferenceId}</TableCell>
                        <TableCell>
                            <Badge variant={req.guestType === 'Crew' ? 'outline' : 'secondary'}>{req.guestType}</Badge>
                        </TableCell>
                        <TableCell>{req.checkIn}</TableCell>
                        <TableCell>{req.checkOut}</TableCell>
                        <TableCell>{req.rooms}</TableCell>
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
                                        <DropdownMenuItem>Propose Alternate</DropdownMenuItem>
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
