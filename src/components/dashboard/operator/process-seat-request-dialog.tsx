
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SeatAllocation, SeatAllocationStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface ProcessSeatRequestDialogProps {
  request: SeatAllocation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessSeatRequestDialog({ request, open, onOpenChange }: ProcessSeatRequestDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleUpdate = (status: SeatAllocationStatus) => {
    if (!request || !firestore) return;

    // Path synchronized with the root institutional seatAllocations registry
    const path = `seatAllocations/${request.id}`;
    const reqRef = (firestore as any)._isMock
        ? { path } as any
        : doc(firestore, 'seatAllocations', request.id);
        
    updateDocumentNonBlocking(reqRef, { 
        status,
        updatedAt: new Date().toISOString()
    });

    toast({
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `Seat allocation for ${request.customerName || 'Client'} has been ${status}.`,
    });
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-code font-bold text-accent border-accent/20">MANIFEST REVIEW: {request.id}</Badge>
          </div>
          <DialogTitle className="text-xl font-bold font-headline text-white">Passenger Manifest & Verification</DialogTitle>
          <DialogDescription className="text-white/60">Review institutional client requirements and passenger identity details before approving the seat block.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Requester Entity</p>
                    <p className="text-sm font-bold text-white">{request.customerName || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Seat Block Size</p>
                    <p className="text-sm font-bold text-accent flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" /> {request.seatsRequested} PAX
                    </p>
                </div>
            </div>

            {request.passengers && request.passengers.length > 0 && (
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Verified Passengers</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {request.passengers.map((p, i) => (
                            <div key={i} className="p-3 rounded-lg border border-white/5 bg-black/20 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-white">{p.fullName}</p>
                                    <p className="text-[10px] text-white/40 uppercase">{p.nationality} • {p.idType}: {p.idNumber}</p>
                                </div>
                                <ShieldCheck className="h-4 w-4 text-emerald-500/40" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Coordination Notes</p>
                <div className="p-3 rounded-lg bg-muted/20 border border-white/5 italic text-[11px] text-muted-foreground leading-relaxed">
                    "{request.passengerNotes || "Standard institutional profile. No special handling requirements logged."}"
                </div>
            </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0 flex-col sm:flex-row border-t border-white/5 pt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-bold uppercase tracking-widest order-3 sm:order-1 text-white/40 hover:text-white hover:bg-white/5">Standby</Button>
            <div className="flex gap-2 flex-1 sm:justify-end order-1 sm:order-2">
                <Button 
                    variant="destructive" 
                    onClick={() => handleUpdate('rejected')}
                    className="flex-1 sm:flex-none text-[10px] font-black uppercase tracking-widest h-10 px-6"
                >
                    <XCircle className="h-3.5 w-3.5 mr-2" /> Decline
                </Button>
                <Button 
                    onClick={() => handleUpdate('approved')}
                    className="flex-1 sm:flex-none bg-green-600 text-white hover:bg-green-700 text-[10px] font-black uppercase tracking-widest h-10 px-6 shadow-lg shadow-green-900/20 border-none"
                >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Approve Block
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
