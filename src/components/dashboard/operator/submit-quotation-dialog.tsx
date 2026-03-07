
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
import { collection } from 'firebase/firestore';
import type { CharterRFQ, Aircraft, AICharterInsight } from '@/lib/types';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);

  const { data: fleet } = useCollection<Aircraft>(fleetQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const { data: aiInsights } = useCollection<AICharterInsight>(
      useMemoFirebase(() => null, []), 
      'aiCharterInsights'
  );
  
  const currentInsight = aiInsights?.find(i => rfq && rfq.departure && rfq.arrival && rfq.departure.includes(i.route.split('-')[0]) && rfq.arrival.includes(i.route.split('-')[1]));

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

    // Fix: Use correct collection path to avoid polluting the RFQ array
    const quotesRef = (firestore as any)._isMock
        ? { path: 'quotations' } as any
        : collection(firestore, 'quotations');
    
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
      title: 'Quotation Published',
      description: `Your institutional bid for ${rfq.id} has been published.`,
    });
    onOpenChange(false);
    form.reset();
  };

  if (!rfq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Mission Quotation Terminal</DialogTitle>
          <DialogDescription>
            Publishing technical bid for {rfq.departure} » {rfq.arrival}.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 relative overflow-hidden group mb-2">
            <div className="absolute top-0 right-0 p-2 opacity-5"><Sparkles className="h-12 w-12" /></div>
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-accent/10 rounded-lg">
                    <Zap className="h-3.5 w-3.5 text-accent animate-pulse" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">AeroDesk AI Insight</p>
                    <p className="text-[8px] text-muted-foreground uppercase font-bold">Predictive Market Alignment</p>
                </div>
            </div>
            
            {currentInsight ? (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-muted-foreground">Optimal Asset Match</p>
                        <p className="text-xs font-bold text-foreground">{currentInsight.aircraftRecommendation}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black uppercase text-muted-foreground">Estimated Yield Range</p>
                        <p className="text-xs font-black text-accent">₹ {currentInsight.estimatedPriceMin.toLocaleString()} – ₹ {currentInsight.estimatedPriceMax.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-white/5">
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                            "{currentInsight.recommendation}"
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-[10px] text-muted-foreground italic">AI modeling complete. Standard pricing protocols advised for this sector.</p>
            )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="aircraftId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Deploy Fleet Asset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/20 text-xs">
                        <SelectValue placeholder="Choose an aircraft" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fleet?.map(ac => (
                        <SelectItem key={ac.id} value={ac.id}>{ac.name} ({ac.registration}) — {ac.status}</SelectItem>
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
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Gross Quote (INR)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} className="bg-muted/20 text-xs" />
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
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Validity Limit</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} className="bg-muted/20 text-xs" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Operational Inclusions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Fuel, landing fees, and standard catering included..." {...field} className="bg-muted/20 h-24 text-xs" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    Operators retain final control over pricing. bid submission initiates an immutable coordination thread.
                </p>
            </div>

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest px-8 h-10 shadow-xl shadow-accent/10">
                    Publish Institutional Bid
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
