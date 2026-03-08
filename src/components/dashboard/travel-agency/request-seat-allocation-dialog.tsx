
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
import type { EmptyLeg, SeatAllocationRequest } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, UserPlus, Trash2, Coins, Zap } from 'lucide-react';
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
    if (!user || !emptyLeg) return;

    if (data.numberOfSeats < (emptyLeg.minSeatsPerRequest || 1)) {
        form.setError('numberOfSeats', { message: `Minimum ${emptyLeg.minSeatsPerRequest} seats required for this sector.` });
        return;
    }

    const isMock = !firestore || (firestore as any)._isMock;
    const seatRequestsRef = isMock ? { path: 'seatAllocationRequests' } as any : collection(firestore!, 'seatAllocationRequests');
    
    addDocumentNonBlocking(seatRequestsRef, {
        requestId: `SR-${Date.now().toString().slice(-6)}`,
        flightId: emptyLeg.id,
        operatorId: emptyLeg.operatorId,
        requesterId: user.id,
        requesterName: user.company || `${user.firstName} ${user.lastName}`,
        requesterType: user.platformRole === 'agency' ? 'travelAgency' : user.platformRole === 'corporate' ? 'corporate' : 'individual',
        origin: emptyLeg.departure,
        destination: emptyLeg.arrival,
        seatsRequested: data.numberOfSeats,
        passengers: data.passengers,
        requestStatus: 'PENDING_OPERATOR_APPROVAL',
        totalAmount: data.numberOfSeats * (emptyLeg.pricePerSeat || 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    } as SeatAllocationRequest);

    toast({
      title: 'Allocation Request Submitted',
      description: `Institutional lead for ${emptyLeg.departure} → ${emptyLeg.arrival} has been published to the operator.`,
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
                <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Commercial Lead Submission</span>
                </div>
                <DialogTitle className="text-xl font-bold font-headline uppercase tracking-tight">Initiate Seat Allocation</DialogTitle>
                <DialogDescription>
                    Sector: {emptyLeg.departure} → {emptyLeg.arrival} • Scheduled: {new Date(emptyLeg.departureTime).toLocaleString()}
                </DialogDescription>
            </DialogHeader>
        </div>

        <Separator className="border-white/5" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="numberOfSeats"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest">Quantity of Seats</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" {...field} className="bg-muted/20 border-white/5" />
                    </FormControl>
                    <FormDescription className="text-[10px] font-bold text-accent">Rate: ₹ {(emptyLeg.pricePerSeat || 0).toLocaleString()} / seat</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="clientReference"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black tracking-widest">Client / Account Ref</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. VIP-STARK-01" {...field} className="bg-muted/20 border-white/5" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Manifest Requirements
                    </h4>
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => append({ fullName: '', nationality: '', idType: 'Passport', idNumber: '' })}
                        className="h-7 text-[9px] font-bold border-white/10 uppercase tracking-widest hover:bg-accent/10"
                    >
                        <UserPlus className="h-3 w-3 mr-1" /> Add Passenger
                    </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-4 animate-in fade-in duration-300 relative group/pax">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">PAX {index + 1} Profile</span>
                                {fields.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-rose-500 opacity-0 group-hover/pax:opacity-100 transition-opacity" onClick={() => remove(index)}>
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
                                            <FormControl><Input placeholder="Full Legal Name" {...field} className="h-9 text-xs bg-muted/10 border-white/5" /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`passengers.${index}.nationality`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl><Input placeholder="Nationality" {...field} className="h-9 text-xs bg-muted/10 border-white/5" /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name={`passengers.${index}.idNumber`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl><Input placeholder="Passport / Identification Number" {...field} className="h-9 text-xs bg-muted/10 border-white/5 font-code tracking-tighter" /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <FormField
              control={form.control}
              name="passengerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black tracking-widest">Operational Handling Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dietary requirements, ground assistance needs, or specific manifest instructions..." {...field} className="bg-muted/20 border-white/10 h-24 text-xs resize-none" />
                  </FormControl>
                </FormItem>
              )}
            />

            <Alert className="bg-accent/5 border-accent/20 rounded-xl">
                <Coins className="h-4 w-4 text-accent" />
                <AlertTitle className="text-xs font-black uppercase tracking-widest text-accent">Institutional Value Index</AlertTitle>
                <AlertDescription className="text-lg font-black text-white mt-1">
                    Gross Settlement: ₹ {(form.watch('numberOfSeats') * (emptyLeg.pricePerSeat || 0)).toLocaleString()}
                </AlertDescription>
            </Alert>
          </form>
        </Form>

        <Separator className="border-white/5" />

        <div className="p-6">
            <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cancel Coordination</Button>
                <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest px-10 h-10 shadow-xl shadow-accent/10">
                    Commit Lead Protocol
                </Button>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
