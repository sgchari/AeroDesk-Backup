
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { useCollection, useFirestore, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { CharterRFQ, Aircraft } from '@/lib/types';
import { SystemAdvisory } from './system-advisory';

const quoteSchema = z.object({
  aircraftId: z.string().min(1, 'Please select an aircraft.'),
  quotedPrice: z.coerce.number().positive('Price must be a positive number.'),
  validUntil: z.string().min(1, 'Please specify validity.'),
  remarks: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface SubmitQuotationDialogProps {
  rfq: CharterRFQ | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitQuotationDialog({ rfq, open, onOpenChange }: SubmitQuotationDialogProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const fleetQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);

  const { data: fleet } = useCollection<Aircraft>(fleetQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      quotedPrice: 0,
      validUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      remarks: '',
    },
  });

  const selectedAircraftId = form.watch('aircraftId');
  const selectedAircraft = fleet?.find(a => a.id === selectedAircraftId);

  const onSubmit = (data: QuoteFormValues) => {
    if (!user || !rfq || !firestore) return;

    const quotesRef = collection(firestore, `charterRFQs/${rfq.id}/quotations`);
    
    addDocumentNonBlocking(quotesRef, {
        rfqId: rfq.id,
        operatorId: user.id,
        operatorName: user.company || user.firstName,
        aircraftId: data.aircraftId,
        aircraftName: selectedAircraft?.name || 'Selected Jet',
        price: data.quotedPrice,
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        validUntil: data.validUntil,
        operatorRemarks: data.remarks,
    });

    toast({
      title: 'Quotation Submitted',
      description: `Your bid for ${rfq.id} has been published to the marketplace queue.`,
    });
    onOpenChange(false);
    form.reset();
  };

  if (!rfq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Charter Quotation</DialogTitle>
          <DialogDescription>
            Publishing an institutional bid for {rfq.departure} to {rfq.arrival}.
          </DialogDescription>
        </DialogHeader>

        {selectedAircraft && selectedAircraft.status !== 'Available' && (
            <SystemAdvisory 
                level="WARNING"
                title="Operational Conflict"
                message={`The selected aircraft (${selectedAircraft.registration}) is currently marked as ${selectedAircraft.status}. Ensure maintenance clearance before mission start.`}
            />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="aircraftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Fleet Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an aircraft" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fleet?.map(ac => (
                        <SelectItem key={ac.id} value={ac.id}>{ac.name} ({ac.registration}) - {ac.status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="quotedPrice"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Mission Price (INR)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quote Validity</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operational Notes / Inclusions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Fuel, crew stays, landing fees included. Ground handling subject to additional cost." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                    Publish Institutional Bid
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
