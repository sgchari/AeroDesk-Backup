
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { EmptyLeg } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const seatAllocationSchema = z.object({
  numberOfSeats: z.coerce.number().int().positive('Quantity must be positive.'),
  clientReference: z.string().min(2, 'Client reference helps with coordination.'),
  passengerNotes: z.string().optional(),
});

type SeatAllocationFormValues = z.infer<typeof seatAllocationSchema>;

interface RequestSeatAllocationDialogProps {
  emptyLeg: EmptyLeg | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestSeatAllocationDialog({ emptyLeg, open, onOpenChange }: RequestSeatAllocationDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<SeatAllocationFormValues>({
    resolver: zodResolver(seatAllocationSchema),
    defaultValues: {
      numberOfSeats: 1,
      clientReference: '',
      passengerNotes: '',
    },
  });

  const onSubmit = (data: SeatAllocationFormValues) => {
    if (!user || !emptyLeg || !firestore) {
      toast({ title: 'Error', description: 'System session context missing.', variant: 'destructive' });
      return;
    }

    const seatRequestCollectionRef = collection(firestore, `emptyLegs/${emptyLeg.id}/seatAllocationRequests`);
    
    addDocumentNonBlocking(seatRequestCollectionRef, {
        emptyLegId: emptyLeg.id,
        distributorId: user.id,
        requesterExternalAuthId: user.id,
        numberOfSeats: data.numberOfSeats,
        status: 'Requested',
        requestDateTime: new Date().toISOString(),
        clientReference: data.clientReference,
        passengerNotes: data.passengerNotes || null,
    });

    toast({
      title: 'Commercial Lead Initialized',
      description: `Your request for flight ${emptyLeg.id} has been published to the operator for review.`,
    });
    onOpenChange(false);
    form.reset();
  };
  
  if (!emptyLeg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Initiate Seat Block Request</DialogTitle>
          <DialogDescription>
            Requesting allocation on {emptyLeg.departure} → {emptyLeg.arrival} sector.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-accent/5 border-accent/20">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <AlertTitle className="text-xs font-bold uppercase">Coordination Protocol</AlertTitle>
            <AlertDescription className="text-[10px]">
                This action creates a commercial lead. No instant booking occurs. Allocation is subject to operator feasibility and NSOP compliance.
            </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="numberOfSeats"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Required Seats</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" max={emptyLeg.availableSeats} {...field} />
                    </FormControl>
                    <FormDescription className="text-[10px]">Max: {emptyLeg.availableSeats}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="clientReference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client Account/Ref</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Smith Family" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

             <FormField
              control={form.control}
              name="passengerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operational Notes / Passenger Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Specific needs, passenger profiles, or connection details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                    Submit Commercial Lead
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
