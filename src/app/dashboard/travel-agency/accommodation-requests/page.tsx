
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccommodationRequest } from "@/lib/types";
import { Hotel, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Pending': return 'warning';
        case 'Confirmed': return 'success';
        case 'Declined': return 'destructive';
        case 'Awaiting Clarification': return 'secondary';
        case 'stayConfirmed': return 'success';
        default: return 'outline';
    }
}

export default function AgencyAccommodationRequestsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'accommodationRequests'), where('requesterId', '==', user.id));
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
                description="Institutional workspace for destination stay requests linked to client journeys." 
            />
            
            <div className="grid gap-6">
                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                    <Card className="bg-card overflow-hidden">
                        <CardHeader>
                            <CardTitle>Stay Request Lifecycle</CardTitle>
                            <CardDescription>Monitor confirmation status and settlement review for hotel stays.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="pl-6 text-[10px] uppercase font-black">Guest & Property</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Stay Dates</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">Rooms</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requests?.map((req) => (
                                            <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs font-bold">
                                                            <Hotel className="h-3.5 w-3.5 text-accent/60" />
                                                            {req.propertyName || 'TBD'}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                            <span className="font-code tracking-tighter uppercase text-accent">{req.id}</span>
                                                            <span className="font-medium text-foreground">{req.guestName || 'VIP Client'}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-[10px] text-muted-foreground font-bold">
                                                        <span className="uppercase">In: {new Date(req.checkIn).toLocaleDateString()}</span>
                                                        <span className="uppercase">Out: {new Date(req.checkOut).toLocaleDateString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-black text-xs">{req.rooms}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(req.status) as any} className="text-[9px] font-black uppercase tracking-tighter h-5">
                                                        {req.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase gap-2 hover:bg-accent/10 hover:text-accent">
                                                        <Link href={`/dashboard/travel-agency/execution/${req.id}?type=accommodation`}>
                                                            Execution <ArrowRight className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {(!requests || requests.length === 0) && (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No active accommodation requests.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
