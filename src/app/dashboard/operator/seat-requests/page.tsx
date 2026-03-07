
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SeatAllocationRequest, SeatRequestStatus } from "@/lib/types";
import { 
    Users, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ShieldCheck, 
    ArrowRight, 
    CreditCard,
    FileText,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { ProcessSeatRequestDialog } from "@/components/dashboard/operator/process-seat-request-dialog";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: SeatRequestStatus) => {
    switch (status) {
        case 'REQUEST_SUBMITTED':
        case 'PENDING_OPERATOR_APPROVAL':
            return <Badge className="bg-amber-500/20 text-amber-500 border-none uppercase text-[9px] font-black">{status.replace(/_/g, ' ')}</Badge>;
        case 'APPROVED':
        case 'CONFIRMED':
        case 'COMPLETED':
            return <Badge className="bg-emerald-500/20 text-emerald-500 border-none uppercase text-[9px] font-black">{status.replace(/_/g, ' ')}</Badge>;
        case 'WAITING_PAYMENT':
        case 'PAYMENT_CONFIRMED':
            return <Badge className="bg-blue-500/20 text-blue-500 border-none uppercase text-[9px] font-black">{status.replace(/_/g, ' ')}</Badge>;
        case 'REJECTED':
            return <Badge className="bg-rose-500/20 text-rose-500 border-none uppercase text-[9px] font-black">{status.replace(/_/g, ' ')}</Badge>;
        default:
            return <Badge variant="outline" className="uppercase text-[9px] font-black">{status}</Badge>;
    }
};

export default function SeatRequestsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedRequest, setSelectedRequest] = useState<SeatAllocationRequest | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pending");

  const opId = user?.operatorId || 'op-west-01';

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || opId === 'NONE') return null;
    return query(collection(firestore, 'seatAllocationRequests'), where('operatorId', '==', opId));
  }, [firestore, opId]);
  
  const { data: allRequests, isLoading } = useCollection<SeatAllocationRequest>(requestsQuery, 'seatAllocationRequests');

  const filteredRequests = useMemo(() => {
    if (!allRequests) return [];
    if (activeTab === 'pending') return allRequests.filter(r => r.requestStatus === 'PENDING_OPERATOR_APPROVAL' || r.requestStatus === 'REQUEST_SUBMITTED');
    if (activeTab === 'approved') return allRequests.filter(r => r.requestStatus === 'APPROVED');
    if (activeTab === 'payment') return allRequests.filter(r => r.requestStatus === 'WAITING_PAYMENT' || r.requestStatus === 'PAYMENT_CONFIRMED');
    if (activeTab === 'confirmed') return allRequests.filter(r => r.requestStatus === 'CONFIRMED' || r.requestStatus === 'COMPLETED');
    if (activeTab === 'rejected') return allRequests.filter(r => r.requestStatus === 'REJECTED');
    return allRequests;
  }, [allRequests, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Institutional Seat Allocation" 
        description="Govern individual seat block requests, verify manifests, and coordinate commercial settlements." 
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
            <TabsTrigger value="pending" className="gap-2 flex-1 min-w-[120px]">
                <Clock className="h-3.5 w-3.5" /> Pending Review
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2 flex-1 min-w-[120px]">
                <ShieldCheck className="h-3.5 w-3.5" /> Approved
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2 flex-1 min-w-[120px]">
                <CreditCard className="h-3.5 w-3.5" /> Settlement
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="gap-2 flex-1 min-w-[120px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2 flex-1 min-w-[120px]">
                <XCircle className="h-3.5 w-3.5" /> Rejected
            </TabsTrigger>
        </TabsList>

        <Card className="bg-card border-white/5 shadow-2xl">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold">Coordination Workspace</CardTitle>
                        <CardDescription className="text-xs uppercase font-black text-muted-foreground tracking-widest mt-1">
                            Current Queue: {activeTab.toUpperCase()}
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="h-6 border-white/10 font-code text-[10px]">
                        SIGNAL STRENGTH: 100%
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? <div className="p-8"><Skeleton className="h-64 w-full" /></div> : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="pl-6 text-[10px] uppercase font-black">Lead / Ref</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Requester</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Sector</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black text-center">PAX</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Protocol State</TableHead>
                                    <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                                        <TableCell className="pl-6 py-4 font-code text-xs text-accent font-bold uppercase tracking-widest">{req.requestId}</TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-white">{req.requesterName}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">{req.requesterType}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs font-bold text-foreground">{req.origin} → {req.destination}</p>
                                            <p className="text-[9px] text-muted-foreground uppercase font-bold">{new Date(req.createdAt).toLocaleDateString()}</p>
                                        </TableCell>
                                        <TableCell className="text-center font-black text-xs text-white">{req.seatsRequested}</TableCell>
                                        <TableCell>
                                            {getStatusBadge(req.requestStatus)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => setSelectedRequest(req)}
                                                className="h-8 text-[9px] font-black uppercase tracking-widest gap-2 hover:bg-accent/10 hover:text-accent transition-all"
                                            >
                                                Audit Lead <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {filteredRequests.length === 0 && (
                            <div className="text-center py-20 opacity-30">
                                <Activity className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Synchronized</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
      </Tabs>

      <ProcessSeatRequestDialog 
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </div>
  );
}
