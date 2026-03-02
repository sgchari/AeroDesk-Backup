'use client';

import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { EmptyLeg, BookingChannel, PricingModel } from '@/lib/types';
import { Armchair, ShieldCheck, Coins } from 'lucide-react';

const configSchema = z.object({
  seatAllocationEnabled: z.boolean(),
  totalCapacity: z.coerce.number().min(1),
  pricePerSeat: z.coerce.number().min(0),
  minSeatsPerRequest: z.coerce.number().min(1),
  bookingChannelAllowed: z.enum(['agency', 'direct', 'both']),
  pricingModel: z.enum(['fixed', 'tiered']),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export function ConfigureSeatAllocationDialog({ leg, open, onOpenChange }: { leg: EmptyLeg | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      seatAllocationEnabled: false,
      totalCapacity: 8,
      pricePerSeat: 0,
      minSeatsPerRequest: 1,
      bookingChannelAllowed: 'both',
      pricingModel: 'fixed',
    },
  });

  useEffect(() => {
    if (leg) {
      form.reset({
        seatAllocationEnabled: leg.seatAllocationEnabled || false,
        totalCapacity: leg.totalCapacity || leg.availableSeats || 8,
        pricePerSeat: leg.pricePerSeat || 0,
        minSeatsPerRequest: leg.minSeatsPerRequest || 1,
        bookingChannelAllowed: (leg.bookingChannelAllowed as any) || 'both',
        pricingModel: leg.pricingModel || 'fixed',
      });
    }
  }, [leg, form]);

  const onSubmit = (data: ConfigFormValues) => {
    if (!leg || !firestore) return;

    const legRef = doc(firestore, 'emptyLegs', leg.id);
    
    updateDocumentNonBlocking(legRef, {
        ...data,
        status: data.seatAllocationEnabled ? 'live' : leg.status,
        updatedAt: new Date().toISOString(),
    });

    toast({
      title: 'Allocation Strategy Synchronized',
      description: `Seat allocation parameters for ${leg.id} have been updated.`,
    });
    onOpenChange(false);
  };

  if (!leg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Armchair className="h-5 w-5 text-accent" />
            <DialogTitle>Configure Seat Allocation</DialogTitle>
          </div>
          <DialogDescription>Enable individual seat sales for this positioning flight. This action transitions the flight status to institutional marketplace visibility.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
                control={form.control}
                name="seatAllocationEnabled"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-accent/5 border-accent/20">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Enable Seat Sales</FormLabel>
                            <FormDescription className="text-[10px]">Allow individual seat requests on this mission.</FormDescription>
                        </div>
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="totalCapacity" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black">Aircraft Capacity</FormLabel>
                        <FormControl><Input type="number" {...field} className="bg-muted/20" /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="minSeatsPerRequest" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black">Min. Seats / Req</FormLabel>
                        <FormControl><Input type="number" {...field} className="bg-muted/20" /></FormControl>
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="pricePerSeat" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black">Price / Seat (INR)</FormLabel>
                        <FormControl><Input type="number" {...field} className="bg-muted/20" /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="pricingModel" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black">Pricing Model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-muted/20"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="fixed">Fixed Rate</SelectItem>
                                <SelectItem value="tiered">Tiered Volume</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="bookingChannelAllowed" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Booking Channel Authorization</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-muted/20"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="both">All Channels (Direct & Agency)</SelectItem>
                            <SelectItem value="agency">Agency Only (Conditional Revenue Share)</SelectItem>
                            <SelectItem value="direct">Direct Platform Only</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />

            <div className="p-3 rounded-lg bg-muted/20 border border-white/5 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    "Seat allocation is subject to aircraft positioning. Operators maintain final approval authority for all passenger manifests."
                </p>
            </div>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Discard</Button>
                <Button type="submit" className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest">Publish Strategy</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
