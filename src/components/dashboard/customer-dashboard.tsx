
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus, SeatAllocationRequest } from "@/lib/types";
import { MoreHorizontal, FileText, Clock, CheckCircle, Plane, Hotel, AlertTriangle, ArrowRight, Gavel, XCircle, Users, Armchair, Info, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const getStatusInfo = (status: RfqStatus | string): { text: string; icon: React.ElementType; className: string } => {
    switch (status) {
        case 'Draft':
        case 'New':
        case 'Submitted':
            return { text: 'Under Coordination', icon: Clock, className: 'text-amber-600 bg-amber-100' };
        case 'Pending Approval':
        case 'Reviewing':
            return { text: 'Action Required', icon: AlertTriangle, className: 'text-rose-600 bg-rose-100' };
        case 'Bidding Open':
            return { text: 'Bidding Open', icon: Gavel, className: 'text-blue-600 bg-blue-100' };
        case 'quoteAccepted':
        case 'awaitingManifest':
        case 'manifestSubmitted':
        case 'manifestApproved':
        case 'invoiceIssued':
        case 'paymentSubmitted':
            return { text: 'Execution Phase', icon: Clock, className: 'text-indigo-600 bg-indigo-100' };
        case 'charterConfirmed':
        case 'operationalPreparation':
        case 'preFlightReady':
            return { text: 'Mission Ready', icon: ShieldCheck, className: 'text-green-600 bg-green-100' };
        case 'boarding':
        case 'departed':
        case 'arrived':
            return { text: 'Live Flight', icon: Plane, className: 'text-sky-600 bg-sky-100 animate-pulse' };
        case 'flightCompleted':
            return { text: 'Completed', icon: CheckCircle, className: 'text-emerald-600 bg-emerald-100' };
        case 'tripClosed':
            return { text: 'Closed', icon: XCircle, className: 'text-gray-500 bg-gray-100' };
        default:
            return { text: status, icon: Info, className: 'text-gray-600 bg-gray-100' };
    }
}

const TripCard = ({ rfq }: { rfq: CharterRFQ }) => {
    const statusInfo = getStatusInfo(rfq.status);
    return (
        <Link href={`/dashboard/charter/${rfq.id}`}>
            <Card className="bg-card flex flex-col group hover:border-accent/50 transition-all cursor-pointer h-full">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold border-white/10 group-hover:border-accent/30">
                            {rfq.tripType}
                        </Badge>
                        <span className="font-code text-[10px] text-muted-foreground">{rfq.id}</span>
                    </div>
                    <CardTitle className="text-base group-hover:text-accent transition-colors truncate">
                        {rfq.departure.split(' (')[0]} <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" /> {rfq.arrival.split(' (')[0]}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-[11px]">
                    <div className="flex items-center text-muted-foreground">
                        <Plane className="mr-2 h-3.5 w-3.5 text-accent/60" />
                        <span>{new Date(rfq.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-3.5 w-3.5 text-accent/60" />
                        <span>{rfq.pax} Passengers • {rfq.aircraftType}</span>
                    </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4 px-6">
                    <Badge className={cn("w-full justify-center text-[10px] h-7 font-bold uppercase tracking-wider", statusInfo.className)}>
                        <statusInfo.icon className="mr-1.5 h-3 w-3"/>
                        {statusInfo.text}
                    </Badge>
                </CardFooter>
            </Card>
        </Link>
    );
};

export function CustomerDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(collection(firestore, 'charterRequests'), where('customerId', '==', user.id));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const { data: seatRequests, isLoading: seatRequestsLoading } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');

  const isLoading = isUserLoading || rfqsLoading || seatRequestsLoading;

  const mySeatRequests = React.useMemo(() => {
    return seatRequests?.filter(r => r.requesterId === user?.id) || [];
  }, [seatRequests, user?.id]);

  return (
    <div className="space-y-10">
      <PageHeader title="My Terminal" description="Institutional visibility into your flight requests and active coordination.">
        <CreateRfqDialog />
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="space-y-12">
            {/* --- CHARTER MISSIONS --- */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        Charter Missions
                    </h3>
                    <Badge variant="outline" className="border-white/10 text-[10px] font-bold">{rfqs?.length || 0} TOTAL</Badge>
                </div>
                {rfqs && rfqs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rfqs.map(rfq => (
                            <TripCard 
                                key={rfq.id} 
                                rfq={rfq} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-card/20 border-white/5 opacity-60">
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No active charter missions</p>
                    </div>
                )}
            </section>

            {/* --- JET SEAT REQUESTS --- */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Armchair className="h-5 w-5 text-accent" />
                        Jet Seat Exchange leads
                    </h3>
                    <Badge variant="outline" className="border-white/10 text-[10px] font-bold">{mySeatRequests.length} ACTIVE</Badge>
                </div>
                {mySeatRequests.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mySeatRequests.map(req => (
                            <Card key={req.id} className="bg-card border-white/5 hover:border-accent/30 transition-all overflow-hidden group">
                                <CardHeader className="pb-3 pt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-black border-accent/20 text-accent">LEAD ID: {req.requestId}</Badge>
                                        <Badge className="bg-blue-500/20 text-blue-400 border-none h-5 text-[8px] font-black uppercase px-2">
                                            {req.requestStatus.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-base group-hover:text-accent transition-colors">
                                        {req.origin} → {req.destination}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pb-5">
                                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-3.5 w-3.5 text-accent/60" />
                                            <span>{req.seatsRequested} Seats Allocated</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-accent/60" />
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Button asChild variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-accent group-hover:text-white transition-colors">
                                        <Link href={`/dashboard/customer/seat-execution/${req.id}`}>
                                            Audit Progress <ArrowRight className="h-3 w-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-card/20 border-white/5 opacity-60">
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No active jet seat leads</p>
                    </div>
                )}
            </section>
        </div>
      )}
    </div>
  );
}
