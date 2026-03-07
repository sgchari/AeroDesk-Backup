'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { SeatAllocationRequest, SeatRequestStatus, SeatInvoice, EmptyLeg, SeatPayment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle2, XCircle, ShieldCheck, FileText, AlertCircle, Coins, Download, Verified } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ProcessSeatRequestDialogProps {
  request: SeatAllocationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessSeatRequestDialog({ request, open, onOpenChange }: ProcessSeatRequestDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [rejectionReason, setRejectionReason] = useState<any>(null);

  const { data: flights } = useCollection<EmptyLeg>(null, 'emptyLegs');
  const flight = flights?.find(f => f.id === request?.flightId);

  const { data: payments } = useCollection<SeatPayment>(null, 'seatPayments');
  const activePayment = payments?.find(p => p.requestId === request?.requestId);

  const handleUpdate = async (newStatus: SeatRequestStatus) => {
    if (!request || !firestore) return;

    const reqPath = `seatAllocationRequests/${request.id}`;
    const reqRef = (firestore as any)._isMock ? { path: reqPath } as any : doc(firestore, 'seatAllocationRequests', request.id);
        
    const updateData: any = { 
        requestStatus: newStatus,
        updatedAt: new Date().toISOString()
    };

    if (newStatus === 'REJECTED' && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
    }

    updateDocumentNonBlocking(reqRef, updateData);

    // SEAT NOTIFICATION PROTOCOL
    const notifyRef = (firestore as any)._isMock ? { path: 'notifications' } as any : collection(firestore, 'notifications');
    addDocumentNonBlocking(notifyRef, {
        userId: request.requesterId,
        type: newStatus === 'APPROVED' ? 'SEAT_REQUEST_APPROVED' : newStatus === 'REJECTED' ? 'SEAT_REQUEST_REJECTED' : 'SEAT_CONFIRMED',
        message: `Seat request ${request.requestId} updated to ${newStatus}.`,
        read: false,
        createdAt: new Date().toISOString()
    });

    if (newStatus === 'APPROVED') {
        const invoiceRef = (firestore as any)._isMock ? { path: 'seatInvoices' } as any : collection(firestore, 'seatInvoices');
        addDocumentNonBlocking(invoiceRef, {
            invoiceId: `INV-${Date.now().toString().slice(-6)}`,
            requestId: request.requestId,
            operatorId: request.operatorId,
            seatsBooked: request.seatsRequested,
            seatPrice: (request.totalAmount || 0) / request.seatsRequested,
            totalAmount: request.totalAmount || 0,
            currency: 'INR',
            invoiceStatus: 'ISSUED',
            paymentMode: 'OFFLINE_TRANSFER',
            createdAt: new Date().toISOString()
        } as SeatInvoice);
        updateDocumentNonBlocking(reqRef, { requestStatus: 'WAITING_PAYMENT' });
    }

    if (newStatus === 'PAYMENT_CONFIRMED' && flight) {
        // Reduced inventory logic
        const flightRef = (firestore as any)._isMock ? { path: `emptyLegs/${flight.id}` } as any : doc(firestore, 'emptyLegs', flight.id);
        const newRemaining = Math.max(0, flight.availableSeats - request.seatsRequested);
        updateDocumentNonBlocking(flightRef, { 
            availableSeats: newRemaining,
            status: newRemaining === 0 ? 'SOLD_OUT' : flight.status
        });

        // Update Manifest
        const manifestRef = (firestore as any)._isMock ? { path: 'flightPassengerManifests' } as any : collection(firestore, 'flightPassengerManifests');
        addDocumentNonBlocking(manifestRef, {
            flightId: flight.id,
            passengers: request.passengers.map(p => ({
                name: p.fullName,
                requestId: request.requestId,
                seatNumber: 'TBD'
            })),
            lastUpdated: new Date().toISOString()
        });

        // Final confirmed status
        updateDocumentNonBlocking(reqRef, { requestStatus: 'CONFIRMED' });
    }

    toast({
      title: `Lead Processor: ${newStatus}`,
      description: `Institutional state synchronized for mission lead ${request.requestId}.`,
    });
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-code font-black text-accent border-accent/20 bg-accent/5">
                LEAD ID: {request.requestId}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold font-headline text-white uppercase tracking-tighter">Process Mission Lead</DialogTitle>
          <DialogDescription className="text-white/60">Institutional verification of manifest and commercial compliance.</DialogDescription>
        </DialogHeader>

        <Separator className="border-white/5" />

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Requester</p>
                    <p className="text-sm font-bold text-white">{request.requesterName}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Allocation</p>
                    <p className="text-sm font-black text-accent flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> {request.seatsRequested} PAX
                    </p>
                </div>
            </div>

            {activePayment && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Payment Proof Logged</p>
                        <Badge className="bg-blue-500/20 text-blue-400 border-none text-[8px] h-4">AUDIT REQUIRED</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-white font-mono">{activePayment.paymentReference}</p>
                        <Button variant="ghost" size="sm" className="h-7 text-[8px] font-bold uppercase gap-2 hover:bg-blue-500/10">
                            <Download className="h-3 w-3" /> View Asset
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Institutional Manifest</p>
                <div className="space-y-2">
                    {request.passengers.map((p, i) => (
                        <div key={i} className="p-3 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between group hover:border-accent/20 transition-all">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-white">{p.fullName}</p>
                                <p className="text-[10px] text-white/40 uppercase font-bold">{p.nationality} • {p.idType}: {p.idNumber}</p>
                            </div>
                            <ShieldCheck className="h-4 w-4 text-emerald-500/40 group-hover:text-emerald-500 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {request.requestStatus === 'PENDING_OPERATOR_APPROVAL' && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Decline Protocol</Label>
                    <Select onValueChange={setRejectionReason}>
                        <SelectTrigger className="bg-muted/20 border-white/10 h-10 text-xs">
                            <SelectValue placeholder="Select Reason if Rejecting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SOLD_OUT">Mission Sold Out</SelectItem>
                            <SelectItem value="AIRCRAFT_AOG">Aircraft AOG (Technical)</SelectItem>
                            <SelectItem value="MISSION_NOT_AVAILABLE">Mission Cancelled</SelectItem>
                            <SelectItem value="OPERATIONAL_CONSTRAINTS">Operational Constraints</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>

        <Separator className="border-white/5" />

        <DialogFooter className="p-6 gap-3 sm:gap-0 flex-col sm:flex-row">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white order-3 sm:order-1">Standby</Button>
            
            <div className="flex gap-2 flex-1 sm:justify-end order-1 sm:order-2">
                {request.requestStatus === 'PENDING_OPERATOR_APPROVAL' ? (
                    <>
                        <Button variant="destructive" onClick={() => handleUpdate('REJECTED')} className="flex-1 sm:flex-none text-[10px] font-black uppercase h-10 px-6">
                            Decline Lead
                        </Button>
                        <Button onClick={() => handleUpdate('APPROVED')} className="flex-1 sm:flex-none bg-accent text-accent-foreground hover:bg-accent/90 text-[10px] font-black uppercase h-10 px-8">
                            Approve & Invoice
                        </Button>
                    </>
                ) : request.requestStatus === 'PAYMENT_SUBMITTED' ? (
                    <Button onClick={() => handleUpdate('PAYMENT_CONFIRMED')} className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-black uppercase h-10 px-10">
                        <Verified className="h-3.5 w-3.5 mr-2" /> Verify Bank Proof
                    </Button>
                ) : (
                    <Badge variant="outline" className="h-10 px-6 border-white/10 text-white/40 uppercase font-black text-[10px] tracking-widest">
                        Protocol Finalized
                    </Badge>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
