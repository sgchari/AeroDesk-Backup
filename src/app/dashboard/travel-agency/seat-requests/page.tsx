
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { EmptyLegSeatAllocationRequest } from "@/lib/types";
import { collectionGroup, query, where } from "firebase/firestore";
import React from 'react';

const getStatusVariant = (status: EmptyLegSeatAllocationRequest['status']) => {
    switch (status) {
        case 'Requested': return 'warning';
        case 'Approved': return 'success';
        case 'Rejected': return 'destructive';
        case 'Cancelled': return 'secondary';
        default: return 'outline';
    }
}

export default function SeatRequestsPage() {
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    
    // In a real app, this would be a collectionGroup query.
    // The mock store simulates this with a special path.
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        // This is a simplified query for the demo.
        return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);

    const { data: seatRequests, isLoading: requestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(
        requestsQuery,
        'emptyLegs/all/seatAllocationRequests'
    );
    
    const isLoading = isUserLoading || requestsLoading;

    // The mock store returns all requests, so we filter them here for the demo.
    const userSeatRequests = seatRequests?.filter(req => req.requesterExternalAuthId === user?.id);

    return (
        <>
            <PageHeader title="My Seat Requests" description="Track the status of all seat allocation requests you have made." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                    <CardDescription>
                        A list of all your submitted seat allocation requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead>Flight ID</TableHead>
                                    <TableHead>Seats</TableHead>
                                    <TableHead>Client Ref</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userSeatRequests?.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                                        <TableCell className="font-code">{req.emptyLegId}</TableCell>
                                        <TableCell className="font-bold text-center">{req.numberOfSeats}</TableCell>
                                        <TableCell>{(req as any).clientReference || 'N/A'}</TableCell>
                                        <TableCell>{new Date(req.requestDateTime).toLocaleDateString()}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {(!isLoading && (!userSeatRequests || userSeatRequests.length === 0)) && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't made any seat requests yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
