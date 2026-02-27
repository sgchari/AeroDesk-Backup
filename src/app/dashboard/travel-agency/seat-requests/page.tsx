
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { EmptyLegSeatAllocationRequest } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Clock, CheckCircle, XCircle, ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'Requested': return { label: 'Under Coordination', variant: 'warning' as const, icon: Clock };
        case 'Approved': return { label: 'Confirmed Allocation', variant: 'success' as const, icon: CheckCircle };
        case 'Rejected': return { label: 'Declined', variant: 'destructive' as const, icon: XCircle };
        case 'seatPaymentSubmitted': return { label: 'Settlement Review', variant: 'primary' as const, icon: Clock };
        default: return { label: status, variant: 'outline' as const, icon: Clock };
    }
}

export default function SeatRequestsPage() {
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);

    const { data: seatRequests, isLoading: requestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(
        requestsQuery,
        'seatAllocationRequests'
    );
    
    const isLoading = isUserLoading || requestsLoading;

    return (
        <>
            <PageHeader title="Seat Block History" description="Manage and track the commercial lifecycle of client seat allocations." />
            
            <div className="grid gap-6">
                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                    <Card className="bg-card overflow-hidden">
                        <CardHeader>
                            <CardTitle>Commercial Lead Queue</CardTitle>
                            <CardDescription>Time-critical seat requests submitted to fleet operators.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="pl-6 text-[10px] uppercase font-black">Lead Details</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">Seats</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seatRequests?.map((req) => {
                                            const status = getStatusConfig(req.status);
                                            return (
                                                <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-xs font-bold">
                                                                <Plane className="h-3 w-3 text-accent/60" />
                                                                Flight ID: {req.emptyLegId}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                                <span className="font-code tracking-tighter uppercase text-accent">{req.id}</span>
                                                                <span className="font-medium text-foreground">{req.clientReference || 'Standard Client'}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-black text-xs">{req.numberOfSeats}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={status.variant} className="gap-1.5 h-5 text-[9px] font-black uppercase tracking-tighter">
                                                            <status.icon className="h-2.5 w-2.5" />
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase gap-2 hover:bg-accent/10 hover:text-accent">
                                                            <Link href={`/dashboard/travel-agency/execution/${req.id}?type=seat`}>
                                                                Execution <ArrowRight className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            {(!seatRequests || seatRequests.length === 0) && (
                                <div className="text-center py-20">
                                    <p className="text-muted-foreground">No active commercial leads.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
