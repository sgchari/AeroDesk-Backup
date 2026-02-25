
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
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { EmptyLeg } from '@/lib/types';

const seatAllocationSchema = z.object({
  numberOfSeats: z.coerce.number().int().positive('Number of seats must be a positive number.'),
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
    },
  });

  const onSubmit = (data: SeatAllocationFormValues) => {
    if (!user || !emptyLeg) {
      toast({ title: 'Error', description: 'User or flight details are missing.', variant: 'destructive' });
      return;
    }
    if (!firestore) {
        toast({ title: 'Error', description: 'Database service is not available.', variant: 'destructive'});
        return;
    }

    const seatRequestCollectionRef = collection(firestore, `emptyLegs/${emptyLeg.id}/seatAllocationRequests`);
    
    addDocumentNonBlocking(seatRequestCollectionRef, {
        emptyLegId: emptyLeg.id,
        distributorId: user.id, // Assuming distributor user ID is their ID
        requesterExternalAuthId: user.id,
        numberOfSeats: data.numberOfSeats,
        status: 'Requested',
        requestDateTime: new Date().toISOString(),
    });

    toast({
      title: 'Seat Request Submitted',
      description: `Your request for ${data.numberOfSeats} seat(s) on flight ${emptyLeg.id} has been sent to the operator for confirmation.`,
    });
    onOpenChange(false);
    form.reset();
  };
  
  if (!emptyLeg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Seat Allocation</DialogTitle>
          <DialogDescription>
            Request seats on flight {emptyLeg.id} from {emptyLeg.departure} to {emptyLeg.arrival}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="numberOfSeats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Seats</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max={emptyLeg.availableSeats} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <p className="text-sm text-muted-foreground">
                There are currently {emptyLeg.availableSeats} seats available on this flight.
             </p>
            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
