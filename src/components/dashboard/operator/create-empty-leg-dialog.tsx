
'use client';

import { useState, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { useCollection, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Aircraft } from '@/lib/types';
import { SystemAdvisory } from './system-advisory';

const emptyLegSchema = z.object({
  departure: z.string().min(3, 'Required'),
  arrival: z.string().min(3, 'Required'),
  departureTime: z.string().min(1, 'Required'),
  aircraftId: z.string().min(1, 'Select an aircraft'),
  availableSeats: z.coerce.number().positive(),
  pricingStrategy: z.enum(['Fixed', 'Dynamic', 'Negotiable']),
  estimatedPrice: z.coerce.number().optional(),
});

type EmptyLegFormValues = z.infer<typeof emptyLegSchema>;

export function CreateEmptyLegDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: fleet } = useCollection<Aircraft>(
    useMemo(() => firestore && user ? query(collection(firestore, 'operators', user.id, 'aircrafts')) : null, [firestore, user]),
    user ? `operators/${user.id}/aircrafts` : undefined
  );

  const form = useForm<EmptyLegFormValues>({
    resolver: zodResolver(emptyLegSchema),
    defaultValues: {
      departure: '',
      arrival: '',
      departureTime: '',
      aircraftId: '',
      availableSeats: 4,
      pricingStrategy: 'Negotiable',
    },
  });

  const aircraftId = form.watch('aircraftId');
  const selectedAircraft = fleet?.find(a => a.id === aircraftId);

  const onSubmit = (data: EmptyLegFormValues) => {
    if (!user || !firestore) return;

    const legsRef = collection(firestore, 'emptyLegs');
    
    addDocumentNonBlocking(legsRef, {
        operatorId: user.id,
        operatorName: user.company || user.firstName,
        aircraftId: data.aircraftId,
        aircraftName: selectedAircraft?.name || 'Jet',
        departure: data.departure,
        arrival: data.arrival,
        departureTime: data.departureTime,
        availableSeats: data.availableSeats,
        seatsAllocated: 0,
        status: 'Draft',
        seatPricingStrategy: data.pricingStrategy,
        estimatedPricePerSeat: data.estimatedPrice,
        createdAt: new Date().toISOString(),
    });

    toast({ title: 'Draft Created', description: 'Empty leg has been saved to your management queue.' });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
        Create Empty Leg
      </Button>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Revenue Optimization: New Empty Leg</DialogTitle>
          <DialogDescription>Define sector details and seat capacity for positioning flights.</DialogDescription>
        </DialogHeader>

        {selectedAircraft && selectedAircraft.status === 'AOG' && (
            <SystemAdvisory 
                level="CRITICAL"
                title="Aircraft Grounded (AOG)"
                message="This asset is currently non-operational. Maintenance clearance is required before flight."
            />
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departure" render={({ field }) => (
                    <FormItem><FormLabel>Departure</FormLabel><FormControl><Input placeholder="ICAO/IATA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="arrival" render={({ field }) => (
                    <FormItem><FormLabel>Arrival</FormLabel><FormControl><Input placeholder="ICAO/IATA" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departureTime" render={({ field }) => (
                    <FormItem><FormLabel>Departure Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="aircraftId" render={({ field }) => (
                    <FormItem><FormLabel>Aircraft</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Asset" /></SelectTrigger></FormControl>
                            <SelectContent>{fleet?.map(ac => <SelectItem key={ac.id} value={ac.id}>{ac.registration}</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="availableSeats" render={({ field }) => (
                    <FormItem><FormLabel>Seat Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="pricingStrategy" render={({ field }) => (
                    <FormItem><FormLabel>Pricing Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Fixed">Fixed Price</SelectItem>
                                <SelectItem value="Dynamic">Market Driven</SelectItem>
                                <SelectItem value="Negotiable">Negotiable</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Initialize Leg</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
