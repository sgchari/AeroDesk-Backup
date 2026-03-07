
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
import type { SeatAllocationRequest, SeatRequestStatus, SeatInvoice, EmptyLeg } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle2, XCircle, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
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

  // Fetch the related flight to update inventory later
  const { data: flights } = useCollection<EmptyLeg>(null, 'emptyLegs');
  const flight = flights?.find(f => f.id === request?.flightId);

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

    // WORKFLOW LOGIC: APPROVED -> GENERATE INVOICE
    if (newStatus === 'APPROVED') {
        const invoiceRef = (firestore as any)._isMock ? { path: 'seatInvoices' } as any : collection(firestore, 'seatInvoices');
        const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
        
        addDocumentNonBlocking(invoiceRef, {
            invoiceId,
            requestId: request.requestId,
            operatorId: request.operatorId,
            totalSeats: request.seatsRequested,
            seatPrice: (request.totalAmount || 0) / request.seatsRequested,
            totalAmount: request.totalAmount || 0,
            currency: 'INR',
            invoiceStatus: 'ISSUED',
            paymentMode: 'OFFLINE_TRANSFER',
            createdAt: new Date().toISOString()
        } as SeatInvoice);

        // Transition immediately to WAITING_PAYMENT
        updateDocumentNonBlocking(reqRef, { requestStatus: 'WAITING_PAYMENT' });
    }

    // WORKFLOW LOGIC: CONFIRMED -> UPDATE INVENTORY & MANIFEST
    if (newStatus === 'CONFIRMED' && flight) {
        // 1. Update Inventory
        const flightPath = `emptyLegs/${flight.id}`;
        const flightRef = (firestore as any)._isMock ? { path: flightPath } as any : doc(firestore, 'emptyLegs', flight.id);
        const newRemaining = Math.max(0, flight.availableSeats - request.seatsRequested);
        
        updateDocumentNonBlocking(flightRef, { 
            availableSeats: newRemaining,
            status: newRemaining === 0 ? 'SOLD_OUT' : flight.status
        });

        // 2. Update Manifest
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
    }

    toast({
      title: `Lead Processor: ${newStatus}`,
      description: `Commercial state for ${request.requestId} synchronized successfully.`,
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
                PROTOCOL ID: {request.requestId}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold font-headline text-white uppercase tracking-tighter">Mission Lead Audit</DialogTitle>
          <DialogDescription className="text-white/60">Review institutional manifest and commercial parameters before finalizing technical sign-off.</DialogDescription>
        </DialogHeader>

        <Separator className="border-white/5" />

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Lead Origin</p>
                    <p className="text-sm font-bold text-white">{request.requesterName}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Commercial Volume</p>
                    <p className="text-sm font-black text-accent flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> {request.seatsRequested} PAX
                    </p>
                </div>
            </div>

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

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Marketplace Advisory</p>
                    <p className="text-[10px] text-white/60 leading-relaxed italic">
                        Confirming this lead will initiate the invoicing engine and notify the client for settlement. Ensure aircraft positioning is verified.
                    </p>
                </div>
            </div>

            {request.requestStatus === 'PENDING_OPERATOR_APPROVAL' && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Rejection Protocol (If declining)</Label>
                    <Select onValueChange={setRejectionReason}>
                        <SelectTrigger className="bg-muted/20 border-white/10 h-10 text-xs">
                            <SelectValue placeholder="Select Reason for Declining" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SOLD_OUT">Mission Sold Out</SelectItem>
                            <SelectItem value="AIRCRAFT_AOG">Aircraft AOG (Technical)</SelectItem>
                            <SelectItem value="MISSION_NOT_AVAILABLE">Mission Cancelled</SelectItem>
                            <SelectItem value="OPERATIONAL_CONSTRAINTS">Operational/Slot Constraints</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>

        <Separator className="border-white/5" />

        <DialogFooter className="p-6 gap-3 sm:gap-0 flex-col sm:flex-row">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white order-3 sm:order-1">Standby</Button>
            
            <div className="flex gap-2 flex-1 sm:justify-end order-1 sm:order-2">
                {request.requestStatus === 'PENDING_OPERATOR_APPROVAL' || request.requestStatus === 'REQUEST_SUBMITTED' ? (
                    <>
                        <Button 
                            variant="destructive" 
                            onClick={() => handleUpdate('REJECTED')}
                            className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest h-10 px-6 shadow-xl shadow-rose-900/20"
                        >
                            <XCircle className="h-3.5 w-3.5 mr-2" /> Decline lead
                        </Button>
                        <Button 
                            onClick={() => handleUpdate('APPROVED')}
                            className="flex-1 sm:flex-none bg-accent text-accent-foreground hover:bg-accent/90 text-[10px] font-black uppercase tracking-widest h-10 px-8 shadow-xl shadow-accent/10"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve & Invoice
                        </Button>
                    </>
                ) : request.requestStatus === 'WAITING_PAYMENT' ? (
                    <Button 
                        onClick={() => handleUpdate('CONFIRMED')}
                        className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest h-10 px-10"
                    >
                        <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Record Bank Settlement
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
