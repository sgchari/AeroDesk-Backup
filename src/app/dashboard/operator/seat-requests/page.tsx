
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLegSeatAllocationRequest } from "@/lib/types";
import { MoreHorizontal, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collectionGroup, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ProcessSeatRequestDialog } from "@/components/dashboard/operator/process-seat-request-dialog";

export default function SeatRequestsPage() {
  const firestore = useFirestore();
  const [selectedRequest, setSelectedRequest] = useState<EmptyLegSeatAllocationRequest | null>(null);

  // Simulation: Fetch all seat requests for the operator's legs
  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'seatAllocationRequests'));
  }, [firestore]);
  
  const { data: requests, isLoading } = useCollection<EmptyLegSeatAllocationRequest>(requestsQuery, 'emptyLegs/all/seatAllocationRequests');

  return (
    <>
      <PageHeader title="Seat Requests" description="Review time-critical seat allocation leads for your active empty legs." />
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Incoming Request Queue</CardTitle>
          <CardDescription>
            High-intent leads awaiting operator confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Passenger / Client</TableHead>
                    <TableHead className="text-center">Seats</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {requests?.map((req: EmptyLegSeatAllocationRequest) => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                        <TableCell className="font-code">{req.emptyLegId}</TableCell>
                        <TableCell>{req.passengerName || 'Institutional Client'}</TableCell>
                        <TableCell className="text-center font-bold">{req.numberOfSeats}</TableCell>
                        <TableCell className="text-xs">{new Date(req.requestDateTime).toLocaleString()}</TableCell>
                        <TableCell>
                            <Badge variant={req.status === 'Requested' ? 'warning' : req.status === 'Approved' ? 'success' : 'outline'} className="text-[10px] h-5 font-bold uppercase tracking-wider">
                                {req.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Request Control</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedRequest(req)} className="gap-2">Review & Approve</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive gap-2">Reject Request</DropdownMenuItem>
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

      <ProcessSeatRequestDialog 
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </>
  );
}
