'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
  FormDescription
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
import { useCollection, useFirestore, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Aircraft, PricingTier } from '@/lib/types';
import { SystemAdvisory } from './system-advisory';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Zap, ShieldCheck, Armchair } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const primeDestinations = [
    "Agra (AGR)", "Ahmedabad (AMD)", "Amritsar (ATQ)", "Aurangabad (IXU)", "Bagdogra (IXB)",
    "Bengaluru (BLR)", "Bhopal (BHO)", "Bhubaneswar (BBI)", "Chandigarh (IXC)", "Chennai (MAA)",
    "Cochin (COK)", "Coimbatore (CJB)", "Dehradun (DED)", "Delhi (DEL)", "Goa (GOI)",
    "Guwahati (GAU)", "Hyderabad (HYD)", "Imphal (IMF)", "Indore (IDR)", "Jaipur (JAI)",
    "Jammu (IXJ)", "Jodhpur (JDH)", "Khajuraho (HJR)", "Kolkata (CCU)", "Leh (IXL)",
    "Lucknow (LKO)", "Madurai (IXM)", "Mangalore (IXE)", "Mumbai (BOM)", "Nagpur (NAG)",
    "Patna (PAT)", "Port Blair (IXZ)", "Pune (PNQ)", "Raipur (RPR)", "Ranchi (IXR)",
    "Srinagar (SXR)", "Thiruvananthapuram (TRV)", "Tiruchirappalli (TRZ)", "Udaipur (UDR)", "Varanasi (VNS)",
    "Visakhapatnam (VTZ)", "Dubai (DXB)", "London (LHR)", "New York (JFK)", "Singapore (SIN)",
    "Bangkok (BKK)", "Male (MLE)"
];

const AutocompleteInput = ({ value, onChange, placeholder, className }: { value: string; onChange: (value: string) => void; placeholder: string; className?: string }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue.length >= 1) {
            const filtered = primeDestinations.filter(dest =>
                dest.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value.length >= 1) {
                        const filtered = primeDestinations.filter(dest =>
                            dest.toLowerCase().includes(value.toLowerCase())
                        );
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                    }
                }}
                className={className}
                autoComplete="off"
            />
            {showSuggestions && (
                <div className="absolute z-[100] w-full bg-popover border border-border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const emptyLegSchema = z.object({
  departure: z.string().min(3, 'Required'),
  arrival: z.string().min(3, 'Required'),
  departureTime: z.string().min(1, 'Required'),
  aircraftId: z.string().min(1, 'Select an aircraft'),
  totalCapacity: z.coerce.number().min(1),
  basePricePerSeat: z.coerce.number().positive(),
  pricingModel: z.enum(['Fixed', 'Dynamic']),
  seatPricingStrategy: z.array(z.object({
    seatRange: z.string(),
    price: z.coerce.number(),
  })).optional(),
});

type EmptyLegFormValues = z.infer<typeof emptyLegSchema>;

export function CreateEmptyLegDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: fleet } = useCollection<Aircraft>(
    useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return query(collection(firestore, 'operators', user.id, 'aircrafts'));
    }, [firestore, user]),
    user ? `operators/${user.id}/aircrafts` : undefined
  );

  const form = useForm<EmptyLegFormValues>({
    resolver: zodResolver(emptyLegSchema),
    defaultValues: {
      departure: '',
      arrival: '',
      departureTime: '',
      aircraftId: '',
      totalCapacity: 8,
      basePricePerSeat: 45000,
      pricingModel: 'Fixed',
      seatPricingStrategy: [{ seatRange: '1-2', price: 45000 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "seatPricingStrategy",
  });

  const aircraftId = form.watch('aircraftId');
  const pricingModel = form.watch('pricingModel');
  const selectedAircraft = fleet?.find(a => a.id === aircraftId);

  const onSubmit = (data: EmptyLegFormValues) => {
    if (!user || !firestore) return;

    const legsRef = (firestore as any)._isMock 
        ? { path: 'emptyLegs' } as any 
        : collection(firestore, 'emptyLegs');
    
    addDocumentNonBlocking(legsRef, {
        operatorId: user.id,
        operatorName: user.company || user.firstName,
        aircraftId: data.aircraftId,
        aircraftName: selectedAircraft?.name || 'Jet',
        aircraftType: selectedAircraft?.type || 'Light Jet',
        departure: data.departure,
        arrival: data.arrival,
        departureTime: data.departureTime,
        totalCapacity: data.totalCapacity,
        availableSeats: data.totalCapacity,
        basePricePerSeat: data.basePricePerSeat,
        pricingModel: data.pricingModel,
        seatPricingStrategy: data.pricingModel === 'Dynamic' ? data.seatPricingStrategy : null,
        status: 'Published',
        createdAt: new Date().toISOString(),
    });

    toast({ title: 'JetSeat Exchange Initialized', description: 'Empty leg has been published to the institutional marketplace.' });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-9 px-6 shadow-xl shadow-accent/10">
        <Plus className="h-3.5 w-3.5 mr-2" />
        Initialize JetSeat Exchange
      </Button>
      <DialogContent className="sm:max-w-[650px] overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
            <DialogTitle className="text-xl font-bold font-headline">Revenue Optimization Console</DialogTitle>
          </div>
          <DialogDescription>Convert aircraft positioning flights into allocatable seat inventory with dynamic yield rules.</DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 flex-1 overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departure" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Origin Terminal</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="e.g. Mumbai (VABB)" 
                                value={field.value} 
                                onChange={field.onChange} 
                                className="bg-muted/20"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="arrival" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Destination Terminal</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="e.g. Goa (VOGO)" 
                                value={field.value} 
                                onChange={field.onChange} 
                                className="bg-muted/20"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="departureTime" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Departure Schedule</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} className="bg-muted/20" /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="aircraftId" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Assign Asset</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-muted/20"><SelectValue placeholder="Select Fleet" /></SelectTrigger></FormControl>
                            <SelectContent>{fleet?.map(ac => <SelectItem key={ac.id} value={ac.id}>{ac.registration} ({ac.name})</SelectItem>)}</SelectContent>
                        </Select>
                    </FormItem>
                )} />
            </div>

            <Separator className="border-white/5" />

            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Armchair className="h-5 w-5 text-accent" />
                    <div>
                        <p className="text-xs font-black text-white uppercase tracking-widest">JetSeat Inventory Logic</p>
                        <p className="text-[9px] text-muted-foreground uppercase">Configure seat capacity and dynamic pricing rules.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="totalCapacity" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black">Allocatable Seats</FormLabel>
                            <FormControl><Input type="number" {...field} className="bg-black/20" /></FormControl>
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="pricingModel" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black">Pricing Protocol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="bg-black/20"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Fixed">Static Rate</SelectItem>
                                    <SelectItem value="Dynamic">Yield-Driven (Tiers)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>

                {pricingModel === 'Fixed' ? (
                    <FormField control={form.control} name="basePricePerSeat" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black">Flat Price / Seat (INR)</FormLabel>
                            <FormControl><Input type="number" {...field} className="bg-black/20" /></FormControl>
                        </FormItem>
                    )} />
                ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Dynamic Yield Tiers</Label>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ seatRange: '', price: 0 })} className="h-7 text-[9px] border-white/10">
                                <Plus className="h-3 w-3 mr-1" /> Add Tier
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2 items-end">
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[8px] uppercase">PAX Range</Label>
                                        <Input {...form.register(`seatPricingStrategy.${index}.seatRange`)} placeholder="e.g. 1-2" className="h-8 text-xs bg-black/20" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Label className="text-[8px] uppercase">Rate (INR)</Label>
                                        <Input type="number" {...form.register(`seatPricingStrategy.${index}.price`)} className="h-8 text-xs bg-black/20" />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 text-rose-500">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-muted/20 border border-white/5 rounded-lg flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    By publishing, this flight data will be synchronized across the AeroDesk network. All seat bookings are subject to final operator manifest confirmation.
                </p>
            </div>

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-[10px] font-black uppercase tracking-widest">Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest px-10 h-10 shadow-xl shadow-accent/10">
                    Publish to Exchange
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
