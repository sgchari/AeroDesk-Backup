
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
import type { EmptyLegSeatAllocationRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';

interface ProcessSeatRequestDialogProps {
  request: EmptyLegSeatAllocationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessSeatRequestDialog({ request, open, onOpenChange }: ProcessSeatRequestDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleUpdate = (status: 'Approved' | 'Rejected') => {
    if (!request || !firestore) return;

    const path = `emptyLegs/${request.emptyLegId}/seatAllocationRequests/${request.id}`;
    const reqRef = (firestore as any)._isMock
        ? { path } as any
        : doc(firestore, 'emptyLegs', request.emptyLegId, 'seatAllocationRequests', request.id);
        
    updateDocumentNonBlocking(reqRef, { status });

    toast({
      title: `Request ${status}`,
      description: `Seat allocation for ${request.passengerName || 'Client'} has been ${status.toLowerCase()}.`,
    });
    onOpenChange(false);
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[10px] font-code">{request.id}</Badge>
          </div>
          <DialogTitle>Seat Allocation Review</DialogTitle>
          <DialogDescription>Review passenger requirements for Empty Leg {request.emptyLegId}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Requester</p>
                    <p className="text-sm font-medium">{request.passengerName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Quantity</p>
                    <p className="text-sm font-medium flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {request.numberOfSeats} Seats</p>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Passenger Notes</p>
                <p className="text-xs text-muted-foreground italic bg-muted/20 p-2 rounded">
                    {request.passengerNotes || "No specific requirements provided."}
                </p>
            </div>
        </div>

        <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
            <Button variant="destructive" onClick={() => handleUpdate('Rejected')}>Reject Request</Button>
            <Button onClick={() => handleUpdate('Approved')} className="bg-green-600 text-white hover:bg-green-700">Approve Allocation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
