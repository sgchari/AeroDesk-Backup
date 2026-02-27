
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, FileText, Clock, CheckCircle, Plane, Hotel, AlertTriangle, ArrowRight, Gavel, XCircle, Users, Armchair, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const getStatusInfo = (status: RfqStatus): { text: string; icon: React.ElementType; className: string } => {
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
                        {rfq.departure} <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" /> {rfq.arrival}
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
                <CardFooter className="pt-0">
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
    if (!firestore || !user) return null;
    return query(collection(firestore, 'charterRequests'), where('customerId', '==', user.id));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const isLoading = isUserLoading || rfqsLoading;

  return (
    <>
      <PageHeader title="My Trips" description="Track your flight requests, view confirmations, and coordinate logistics.">
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
        <>
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
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-card/20">
                    <div className="p-4 bg-muted/20 w-fit mx-auto rounded-full mb-4">
                        <Plane className="h-10 w-10 text-muted-foreground/40"/>
                    </div>
                    <h3 className="text-lg font-semibold">No active journeys</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        Your private aviation journey begins here. Request a flight to start the coordination process.
                    </p>
                    <CreateRfqDialog />
                </div>
            )}
        </>
      )}
    </>
  );
}
