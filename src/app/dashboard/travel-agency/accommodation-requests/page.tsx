
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccommodationRequest } from "@/lib/types";
import { Hotel, Calendar, Users, MapPin, Clock } from "lucide-react";

const getStatusVariant = (status: AccommodationRequest['status']) => {
    switch (status) {
        case 'Pending': return 'warning';
        case 'Confirmed': return 'success';
        case 'Declined': return 'destructive';
        case 'Awaiting Clarification': return 'secondary';
        default: return 'outline';
    }
}

export default function AgencyAccommodationRequestsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        // In demo mode, mockStore handles filtering by requesterId
        return collection(firestore, 'accommodationRequests');
    }, [firestore, user]);

    const { data: requests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(
        requestsQuery, 
        'accommodationRequests'
    );

    const isLoading = isUserLoading || requestsLoading;

    return (
        <>
            <PageHeader 
                title="Accommodation Coordination" 
                description="Manage hotel stay requests initiated for your clients' charter journeys." 
            />
            
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Stay Request Lifecycle</CardTitle>
                    <CardDescription>
                        Monitor the status of your hotel partner coordination.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client / Guest</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Check-in / Out</TableHead>
                                    <TableHead className="text-center">Rooms</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests?.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>
                                            <div className="font-medium">{req.guestName || 'VIP Client'}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-code">{req.tripReferenceId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Hotel className="h-3.5 w-3.5 text-accent/60" />
                                                <span className="text-sm">{req.propertyName || 'TBD'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> In: {new Date(req.checkIn).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Out: {new Date(req.checkOut).toLocaleDateString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-bold">{req.rooms} Room(s)</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(req.status)} className="text-[10px] uppercase font-bold tracking-wider">
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && (!requests || requests.length === 0)) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <Hotel className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground">No stay requests found for your client journeys.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
