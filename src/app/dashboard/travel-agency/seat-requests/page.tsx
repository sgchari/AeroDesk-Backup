
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { SeatAllocationRequest } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Clock, CheckCircle, XCircle, ArrowRight, Plane, CreditCard, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'REQUEST_SUBMITTED':
        case 'PENDING_OPERATOR_APPROVAL':
            return { label: 'Under Coordination', variant: 'warning' as const, icon: Clock };
        case 'APPROVED':
        case 'CONFIRMED':
        case 'COMPLETED':
            return { label: 'Confirmed Allocation', variant: 'success' as const, icon: CheckCircle };
        case 'REJECTED':
            return { label: 'Declined', variant: 'destructive' as const, icon: XCircle };
        case 'WAITING_PAYMENT':
        case 'PAYMENT_CONFIRMED':
            return { label: 'Settlement Review', variant: 'default' as const, icon: CreditCard };
        default: return { label: status.replace(/_/g, ' '), variant: 'outline' as const, icon: Clock };
    }
}

export default function AgencySeatRequestsPage() {
    const firestore = useFirestore();
    const { user, isLoading: isUserLoading } = useUser();
    
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return query(collection(firestore, 'seatAllocationRequests'), where('requesterId', '==', user.id));
    }, [firestore, user]);

    const { data: seatRequests, isLoading: requestsLoading } = useCollection<SeatAllocationRequest>(
        requestsQuery,
        'seatAllocationRequests'
    );
    
    const isLoading = isUserLoading || requestsLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Seat Block Management" 
                description="Commercial lifecycle of client seat allocations across the operator network." 
            />
            
            <div className="grid gap-6">
                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                    <Card className="bg-card overflow-hidden border-white/5 shadow-2xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-bold">Commercial Lead Feed</CardTitle>
                                    <CardDescription className="text-xs uppercase font-black text-muted-foreground tracking-widest mt-1">
                                        Active blocks across positioning corridors.
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="h-6 border-white/10 font-code text-[10px]">
                                    {seatRequests?.length || 0} TOTAL LEADS
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="pl-6 text-[10px] uppercase font-black">Lead Protocol ID</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">PAX</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-right">Value (INR)</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Current State</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {seatRequests?.map((req) => {
                                            const status = getStatusConfig(req.requestStatus);
                                            return (
                                                <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-accent transition-colors">
                                                                <Plane className="h-3.5 w-3.5 text-accent/60" />
                                                                {req.requestId}
                                                            </div>
                                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                                                <span>{req.origin} » {req.destination}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-black text-xs text-white">{req.seatsRequested}</TableCell>
                                                    <TableCell className="text-right font-code text-xs text-accent font-black">
                                                        ₹ {req.totalAmount?.toLocaleString() || '---'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={status.variant} className="gap-1.5 h-5 text-[9px] font-black uppercase tracking-tighter px-2">
                                                            <status.icon className="h-2.5 w-2.5" />
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button asChild variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-[0.2em] gap-2 hover:bg-accent/10 hover:text-accent">
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
                                <div className="text-center py-24 opacity-30">
                                    <Activity className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Lead Queue Empty</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
