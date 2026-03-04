
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
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: AccommodationRequest['status']) => {
    switch(status) {
        case 'Pending': return 'warning';
        case 'Confirmed': return 'success';
        case 'Declined': return 'destructive';
        case 'Awaiting Clarification': return 'secondary';
        default: return 'outline';
    }
}

export default function HotelRequestsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return query(collection(firestore, 'accommodationRequests'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);
    const { data: accommodationRequests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(requestsQuery, 'accommodationRequests');

    const isLoading = isUserLoading || requestsLoading;

    const handleUpdateStatus = (requestId: string, status: AccommodationRequest['status']) => {
        if (!firestore) return;
        
        const requestDocRef = (firestore as any)._isMock
            ? { path: `accommodationRequests/${requestId}` } as any
            : doc(firestore, 'accommodationRequests', requestId);

        updateDocumentNonBlocking(requestDocRef, { status });
        toast({
            title: "Request Updated",
            description: `The request has been marked as ${status}.`,
        });
    }

  return (
    <>
      <PageHeader title="Accommodation Requests" description="Manage all incoming accommodation requests for your properties." />
      <Card className="bg-card">
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
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Stay Dates</TableHead>
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
                        <TableCell>{req.guestName || 'N/A'}</TableCell>
                        <TableCell>{req.propertyName}</TableCell>
                        <TableCell>{req.checkIn ? new Date(req.checkIn).toLocaleDateString() : 'N/A'} - {req.checkOut ? new Date(req.checkOut).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell className="text-center">{req.rooms}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
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
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'Confirmed')}>Accept Request</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'Declined')}>Decline Request</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'Awaiting Clarification')}>Send Message / Query</DropdownMenuItem>
                                    </>
                                )}
                                 {req.status === 'Awaiting Clarification' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'Confirmed')}>Accept Request</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'Declined')}>Decline Request</DropdownMenuItem>
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
             {(!isLoading && (!accommodationRequests || accommodationRequests.length === 0)) && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No accommodation requests found.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}
