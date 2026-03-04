
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
import { useCollection, useFirestore, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Aircraft } from '@/lib/types';
import { SystemAdvisory } from './system-advisory';
import { cn } from '@/lib/utils';

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
      availableSeats: 4,
      pricingStrategy: 'Negotiable',
    },
  });

  const aircraftId = form.watch('aircraftId');
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
                    <FormItem>
                        <FormLabel>Departure</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="ICAO/IATA" 
                                value={field.value} 
                                onChange={field.onChange} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="arrival" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Arrival</FormLabel>
                        <FormControl>
                            <AutocompleteInput 
                                placeholder="ICAO/IATA" 
                                value={field.value} 
                                onChange={field.onChange} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
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
