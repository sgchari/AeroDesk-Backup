
'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, Plus, X, Armchair, Search, ArrowRight, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { EmptyLeg } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const HelicopterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 5h20" />
    <path d="M12 5v3" />
    <path d="M10 8l2-3 2 3" />
    <path d="M12 8c-4 0-5 2-5 5v3c0 3 1 5 5 5s5-2 5-5v-3c0-3-1-5-5-5z" />
    <path d="M12 8v10" />
    <path d="M7 14c2 1 8 1 10 0" />
    <path d="M9 18l-1.5 4" />
    <path d="M15 18l1.5 4" />
  </svg>
);


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

const AutocompleteInput = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

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
        <div className={cn("relative w-full h-full group/autocomplete", showSuggestions && "z-50")}>
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value.length >= 1) {
                        const filtered = primeDestinations.filter(dest =>
                            dest.toLowerCase().includes(value.toLowerCase())
                        );
                        if (filtered.length > 0) {
                            setSuggestions(filtered);
                            setShowSuggestions(true);
                        }
                    }
                }}
                onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3 px-2 sm:py-2.5"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-[100] left-0 right-0 top-full bg-slate-900 border border-white/20 rounded-b-md shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-3 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/5 last:border-0 text-left transition-colors"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                            }}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export function BookingWidget() {
  const router = useRouter();
  const firestore = useFirestore();
  const [tripType, setTripType] = useState('oneway');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [passengers, setPassengers] = useState('');

  const [legs, setLegs] = useState([
    { id: 1, origin: '', destination: '', departureDate: '', departureTime: '' },
  ]);
  const [nextLegId, setNextLegId] = useState(2);

  const { data: emptyLegs } = useCollection<EmptyLeg>(
    useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'emptyLegs'), where('status', '==', 'live'));
    }, [firestore]),
    'emptyLegs'
  );

  const handleLegChange = (id: number, field: string, value: string) => {
    setLegs(
      legs.map((leg) => (leg.id === id ? { ...leg, [field]: value } : leg))
    );
  };

  const addLeg = () => {
    setLegs([
      ...legs,
      { id: nextLegId, origin: '', destination: '', departureDate: '', departureTime: '' },
    ]);
    setNextLegId((prev) => prev + 1);
  };

  const borderLeg = (id: number) => {
    setLegs(legs.filter((leg) => leg.id !== id));
  };

  const handleSearch = () => {
    router.push('/login');
  };


  return (
    <div className="p-2 sm:p-4 rounded-xl shadow-2xl border border-white/10 max-w-4xl mx-auto bg-black/40 backdrop-blur-xl relative z-20">
        <Tabs defaultValue="jet" className="w-full">
            <TooltipProvider>
                <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0 mb-4 sm:mb-6">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <TabsTrigger value="jet" className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                                <Plane className="h-6 w-6 sm:h-8 sm:w-8" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">JET</span>
                            </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Charter a private jet</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <TabsTrigger value="helicopter" className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                                <HelicopterIcon className="h-6 w-6 sm:h-8 sm:w-8" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">HELI</span>
                            </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Charter a helicopter</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <TabsTrigger value="seats" className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10 relative">
                            <Armchair className="h-6 w-6 sm:h-8 sm:w-8" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">SEATS</span>
                            <Badge className="absolute -top-1 -right-1 bg-accent text-black text-[8px] h-4 px-1 min-w-[16px] flex items-center justify-center font-black">
                                {(emptyLegs?.length || 0)}
                            </Badge>
                        </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Book an empty leg seat</p></TooltipContent>
                    </Tooltip>
                </TabsList>
            </TooltipProvider>
            
            <TabsContent value="jet" className="mt-0">
                <div className="space-y-4">
                    <RadioGroup value={tripType} onValueChange={setTripType} className="flex items-center justify-center gap-4 sm:gap-8 mt-2 mb-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneway" id="oneway" className='text-accent border-accent h-3.5 w-3.5 sm:h-4 sm:w-4' />
                            <Label htmlFor="oneway" className="text-white cursor-pointer text-xs sm:text-sm font-bold uppercase tracking-wider">Oneway</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="round" id="round" className='text-accent border-accent h-3.5 w-3.5 sm:h-4 sm:w-4' />
                            <Label htmlFor="round" className="text-white cursor-pointer text-xs sm:text-sm font-bold uppercase tracking-wider">Round</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multicity" id="multicity" className='text-accent border-accent h-3.5 w-3.5 sm:h-4 sm:w-4' />
                            <Label htmlFor="multicity" className="text-white cursor-pointer text-xs sm:text-sm font-bold uppercase tracking-wider">Multi-City</Label>
                        </div>
                    </RadioGroup>
                    
                    {tripType === 'oneway' && (
                        <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-xl border border-white/10 bg-black/40 overflow-visible">
                            <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                            <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                            <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 sm:py-2.5 text-xs" style={{colorScheme: 'dark'}} />
                            <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 sm:py-2.5 text-xs" style={{colorScheme: 'dark'}} />
                            <Input type="number" placeholder="Pax" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 px-2 sm:py-2.5" />
                        </div>
                    )}
                    
                    {tripType === 'round' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-xl border border-white/10 bg-black/40 overflow-visible">
                                <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 sm:py-2.5" />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                                <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Dep Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Dep Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Ret Date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Ret Time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                            </div>
                        </div>
                    )}

                    {tripType === 'multicity' && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                {legs.map((leg) => (
                                    <div key={leg.id} className="grid grid-cols-1 sm:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] divide-y sm:divide-y-0 sm:divide-x divide-white/10 items-stretch rounded-xl border border-white/10 bg-black/40 overflow-visible relative">
                                        <AutocompleteInput placeholder="Origin" value={leg.origin} onChange={(val) => handleLegChange(leg.id, 'origin', val)} />
                                        <AutocompleteInput placeholder="Destination" value={leg.destination} onChange={(val) => handleLegChange(leg.id, 'destination', val)} />
                                        <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={leg.departureDate} onChange={(e) => handleLegChange(leg.id, 'departureDate', e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                                        <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={leg.departureTime} onChange={(e) => handleLegChange(leg.id, 'departureTime', e.target.value)} className="bg-transparent text-white border-0 rounded-none focus-visible:ring-0 text-center w-full h-full py-3 text-xs" style={{colorScheme: 'dark'}} />
                                        {legs.length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => borderLeg(leg.id)} className="text-destructive h-10 w-full sm:w-10 rounded-none hover:bg-destructive/10 sm:h-full">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" className="w-full h-10 bg-white/5 text-white hover:bg-white/10 border-white/10 text-xs font-black uppercase tracking-widest" onClick={addLeg}>
                                    <Plus className="mr-2 h-4 w-4" /> Add Next Leg
                                </Button>
                            </div>
                            <Input 
                                type="number"
                                placeholder="Total Passengers"
                                value={passengers} 
                                onChange={e => setPassengers(e.target.value)}
                                className="bg-black/40 border border-white/10 text-white rounded-xl h-11 text-center text-sm font-bold"
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-center pt-2">
                        <Button onClick={handleSearch} className="w-full sm:w-auto rounded-xl px-12 h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/10">
                            Search Missions
                        </Button>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="helicopter">
                <p className="text-center py-16 text-xs text-muted-foreground uppercase font-black tracking-widest animate-pulse px-4">Rotary wing coordination protocol in final compliance check.</p>
            </TabsContent>

            <TabsContent value="seats">
                <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col items-center gap-4">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Positioning Hub</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            {(emptyLegs || []).slice(0, 2).map((leg) => (
                                <div key={leg.id} className="p-3 rounded-lg border border-white/5 bg-black/20 flex items-center justify-between group hover:border-accent/30 transition-all cursor-pointer" onClick={() => router.push('/login')}>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-white">{leg.departure} → {leg.arrival}</span>
                                            <Badge variant="outline" className="text-[8px] bg-accent/10 text-accent border-accent/20 h-4">-{Math.round(Math.random() * 20 + 30)}%</Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-[9px] text-white/40 font-medium">
                                            <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(leg.departureTime).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1 uppercase tracking-tighter"><Tag className="h-2.5 w-2.5" /> ₹{(leg.pricePerSeat || 45000).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-accent transition-colors" />
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => router.push('/promotions')} variant="link" className="text-accent text-[10px] uppercase font-black tracking-widest">
                            Explore All Empty Legs <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
