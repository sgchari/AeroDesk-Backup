'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { ShieldCheck, UserPlus, Trash2, Coins } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const passengerSchema = z.object({
  fullName: z.string().min(2, 'Required'),
  nationality: z.string().min(2, 'Required'),
  idType: z.string().default('Passport'),
  idNumber: z.string().min(4, 'Required'),
});

const seatAllocationSchema = z.object({
  numberOfSeats: z.coerce.number().int().positive('Quantity must be positive.'),
  clientReference: z.string().min(2, 'Client reference required.'),
  passengerNotes: z.string().optional(),
  passengers: z.array(passengerSchema).min(1, 'At least one passenger manifest entry is required.'),
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
      passengers: [{ fullName: '', nationality: '', idType: 'Passport', idNumber: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passengers",
  });

  const onSubmit = (data: SeatAllocationFormValues) => {
    if (!user || !emptyLeg || !firestore) return;

    if (data.numberOfSeats < (emptyLeg.minSeatsPerRequest || 1)) {
        form.setError('numberOfSeats', { message: `Minimum ${emptyLeg.minSeatsPerRequest} seats required for this sector.` });
        return;
    }

    const seatAllocationsRef = collection(firestore, 'seatAllocations');
    
    addDocumentNonBlocking(seatAllocationsRef, {
        flightId: emptyLeg.id,
        operatorId: emptyLeg.operatorId,
        customerId: user.id,
        customerName: user.company || user.firstName,
        agencyId: user.agencyId || null,
        bookingChannel: user.platformRole === 'agency' ? 'agency' : user.platformRole === 'corporate' ? 'corporate' : 'direct',
        seatsRequested: data.numberOfSeats,
        pricePerSeat: emptyLeg.pricePerSeat,
        totalAmount: data.numberOfSeats * (emptyLeg.pricePerSeat || 0),
        status: 'pendingApproval',
        paymentStatus: 'pending',
        clientReference: data.clientReference,
        passengerNotes: data.passengerNotes,
        passengers: data.passengers,
        createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Coordination Initialized',
      description: `Commercial lead for ${emptyLeg.departure}-${emptyLeg.arrival} has been published to the operator.`,
    });
    onOpenChange(false);
    form.reset();
  };
  
  if (!emptyLeg) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 pb-2">
            <DialogHeader>
                <DialogTitle>Initiate Seat Allocation Request</DialogTitle>
                <DialogDescription>
                    {emptyLeg.departure} → {emptyLeg.arrival} • {new Date(emptyLeg.departureTime).toLocaleDateString()}
                </DialogDescription>
            </DialogHeader>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="numberOfSeats"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Quantity of Seats</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" {...field} className="bg-muted/20" />
                    </FormControl>
                    <FormDescription className="text-[10px]">Min: {emptyLeg.minSeatsPerRequest || 1}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="clientReference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Client Reference</FormLabel>
                    <FormControl>
                        <Input placeholder="Account Ref / Name" {...field} className="bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5" /> Passenger Manifest
                    </h4>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => append({ fullName: '', nationality: '', idType: 'Passport', idNumber: '' })}
                        className="h-7 text-[9px] font-bold border-white/10"
                    >
                        <UserPlus className="h-3 w-3 mr-1" /> Add Entry
                    </Button>
                </div>
                
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-accent uppercase">PAX {index + 1}</span>
                            {fields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`passengers.${index}.fullName`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Full Name" {...field} className="h-8 text-xs bg-muted/10 border-white/5" /></FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`passengers.${index}.nationality`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Nationality" {...field} className="h-8 text-xs bg-muted/10 border-white/5" /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name={`passengers.${index}.idNumber`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input placeholder="Passport / ID Number" {...field} className="h-8 text-xs bg-muted/10 border-white/5 font-code" /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>

            <FormField
              control={form.control}
              name="passengerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black">Logistics Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catering preferences, mobility needs, or terminal requirements..." {...field} className="bg-muted/20 border-white/10" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Alert className="bg-accent/5 border-accent/20">
                <Coins className="h-4 w-4 text-accent" />
                <AlertTitle className="text-xs font-black uppercase">Institutional Value</AlertTitle>
                <AlertDescription className="text-[10px] font-medium">
                    Estimated Gross Volume: ₹ {(form.watch('numberOfSeats') * (emptyLeg.pricePerSeat || 0)).toLocaleString()}
                </AlertDescription>
            </Alert>
          </form>
        </Form>

        <Separator />

        <div className="p-6">
            <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel Coordination</Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-widest px-8">
                    Commit Lead
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
