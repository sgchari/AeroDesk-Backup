
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
import { Clock, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getStatusConfig = (status: EmptyLegSeatAllocationRequest['status']) => {
    switch (status) {
        case 'Requested': return { label: 'Under Coordination', variant: 'warning' as const, icon: Clock };
        case 'Approved': return { label: 'Confirmed Allocation', variant: 'success' as const, icon: CheckCircle };
        case 'Rejected': return { label: 'Declined by Operator', variant: 'destructive' as const, icon: XCircle };
        case 'Cancelled': return { label: 'Withdrawn', variant: 'secondary' as const, icon: XCircle };
        default: return { label: status, variant: 'outline' as const, icon: Clock };
    }
}

export default function SeatRequestsPage() {
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);

    const { data: seatRequests, isLoading: requestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(
        requestsQuery,
        'emptyLegs/all/seatAllocationRequests'
    );
    
    const isLoading = isUserLoading || requestsLoading;

    return (
        <>
            <PageHeader title="Seat Block History" description="Manage and track the lifecycle of your seat allocation leads for empty leg flights." />
            
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Commercial Lead Queue</CardTitle>
                    <CardDescription>
                        Time-critical requests submitted to operators for seat blocking.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Lead ID</TableHead>
                                    <TableHead>Sector / Flight</TableHead>
                                    <TableHead className="text-center">Capacity</TableHead>
                                    <TableHead>Client Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {seatRequests?.map((req) => {
                                    const status = getStatusConfig(req.status);
                                    return (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium font-code">{req.id}</TableCell>
                                            <TableCell className="font-code text-xs">{req.emptyLegId}</TableCell>
                                            <TableCell className="font-bold text-center">{req.numberOfSeats} Seat(s)</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{req.clientReference || 'Institutional Client'}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{new Date(req.requestDateTime).toLocaleDateString()}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={status.variant} className="gap-1.5 h-6 text-[10px] font-bold uppercase tracking-wider">
                                                    <status.icon className="h-3 w-3" />
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Lead Controls</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Context</DropdownMenuItem>
                                                        <DropdownMenuItem>Contact Operator</DropdownMenuItem>
                                                        {req.status === 'Requested' && <DropdownMenuItem className="text-destructive">Withdraw Request</DropdownMenuItem>}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                     {(!isLoading && (!seatRequests || seatRequests.length === 0)) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven't initiated any commercial seat leads yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
