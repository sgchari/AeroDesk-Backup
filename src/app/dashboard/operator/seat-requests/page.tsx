'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SeatAllocation, SeatAllocationStatus } from "@/lib/types";
import { MoreHorizontal, Users, CheckCircle, XCircle, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ProcessSeatRequestDialog } from "@/components/dashboard/operator/process-seat-request-dialog";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: SeatAllocationStatus | string) => {
    switch (status) {
        case 'pendingApproval': return 'warning';
        case 'approved': return 'success';
        case 'paymentPending': return 'default';
        case 'confirmed': return 'success';
        case 'rejected': return 'destructive';
        case 'cancelled': return 'destructive';
        default: return 'outline';
    }
};

export default function SeatRequestsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<SeatAllocation | null>(null);

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.operatorId) return null;
    return query(collection(firestore, 'seatAllocations'), where('operatorId', '==', user.operatorId));
  }, [firestore, user]);
  
  const { data: requests, isLoading } = useCollection<SeatAllocation>(requestsQuery, 'seatAllocations');

  const handleAction = (request: SeatAllocation, newStatus: SeatAllocationStatus) => {
    if (!firestore) return;
    const reqRef = doc(firestore, 'seatAllocations', request.id);
    
    updateDocumentNonBlocking(reqRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
    });

    // If approved, trigger institutional workflow (Invoice generation simulation)
    if (newStatus === 'approved') {
        const invoiceRef = collection(firestore, 'invoices');
        addDocumentNonBlocking(invoiceRef, {
            relatedEntityId: request.id,
            operatorId: user?.operatorId,
            invoiceNumber: `INV-SEAT-${request.id.slice(-4)}`,
            totalAmount: request.totalAmount,
            status: 'issued',
            createdAt: new Date().toISOString(),
            bankDetails: "AeroBank India • IFSC: AERO0001234 • A/C: 9988776655"
        });
        
        toast({
            title: "Request Approved",
            description: "Institutional invoice has been issued to the requester.",
        });
    }

    // Activity Log
    const logsRef = collection(firestore, 'activityLogs');
    addDocumentNonBlocking(logsRef, {
        entityId: request.id,
        actionType: 'SEAT_ALLOCATION_STATUS_CHANGE',
        performedBy: user?.firstName || 'Operator',
        role: 'operator',
        previousStatus: request.status,
        newStatus: newStatus,
        timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      <PageHeader title="Seat Allocation Queue" description="Review and approve passenger manifests for active seat allocation leads." />
      
      <div className="grid gap-6">
        <Card className="bg-card border-l-4 border-l-accent shadow-2xl">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Commercial Leads & Manifests</CardTitle>
                    <CardDescription>
                        Passenger-level coordination requests requiring operational sign-off.
                    </CardDescription>
                </div>
                {requests && requests.length > 0 && (
                    <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest">
                        {requests.filter(r => r.status === 'pendingApproval').length} ACTION REQUIRED
                    </Badge>
                )}
            </div>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
                <div className="w-full overflow-x-auto">
                    {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                    <Table className="min-w-[850px] sm:min-w-full">
                        <TableHeader>
                        <TableRow className="border-white/5">
                            <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Allocation ID</TableHead>
                            <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Requester / Channel</TableHead>
                            <TableHead className="text-[10px] uppercase font-black text-muted-foreground text-center">Seats</TableHead>
                            <TableHead className="text-[10px] uppercase font-black text-muted-foreground text-right">Value (INR)</TableHead>
                            <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Status</TableHead>
                            <TableHead className="text-right text-[10px] uppercase font-black text-muted-foreground">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {requests?.map((req: SeatAllocation) => (
                            <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                                <TableCell className="font-medium font-code text-xs py-4">{req.id}</TableCell>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-sm text-foreground">{req.customerName || 'Institutional Client'}</div>
                                        <Badge variant="outline" className="text-[8px] uppercase border-white/10 group-hover:border-accent/30">{req.bookingChannel}</Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-black text-sm">{req.seatsRequested}</TableCell>
                                <TableCell className="text-right font-code text-xs text-accent">₹ {req.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(req.status)} className="text-[10px] h-5 font-bold uppercase tracking-wider whitespace-nowrap">
                                        {req.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Logistics Control</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedRequest(req)} className="gap-2">
                                            <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Review Manifest
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {req.status === 'pendingApproval' && (
                                            <>
                                                <DropdownMenuItem onClick={() => handleAction(req, 'approved')} className="text-green-500 font-bold gap-2">
                                                    <CheckCircle className="h-3.5 w-3.5" /> Approve & Issue Invoice
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction(req, 'rejected')} className="text-destructive font-bold gap-2">
                                                    <XCircle className="h-3.5 w-3.5" /> Decline Request
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                        {req.status === 'paymentPending' && (
                                            <DropdownMenuItem className="gap-2">
                                                <Clock className="h-3.5 w-3.5" /> Verify Bank Transfer
                                            </DropdownMenuItem>
                                        )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    )}
                </div>
                {(!isLoading && (!requests || requests.length === 0)) && (
                    <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/5 border-white/5 opacity-60">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Clear</p>
                        <p className="text-[10px] text-muted-foreground mt-1">No active seat requests in the coordination workspace.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <ProcessSeatRequestDialog 
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </>
  );
}
