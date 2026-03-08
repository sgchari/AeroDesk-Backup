'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight, Tag, Clock, Armchair, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { EmptyLeg } from '@/lib/types';
import { useRouter } from 'next/navigation';

const primeDestinations = [
    "Agra (AGR)", "Ahmedabad (AMD)", "Amritsar (ATQ)", "Bengaluru (BLR)", "Chennai (MAA)",
    "Delhi (DEL)", "Goa (GOI)", "Hyderabad (HYD)", "Jaipur (JAI)", "Kolkata (CCU)", "Mumbai (BOM)",
    "Pune (PNQ)", "Dubai (DXB)", "London (LHR)", "Singapore (SIN)"
];

const AutocompleteInput = ({ value, onChange, placeholder, icon: Icon }: { value: string; onChange: (value: string) => void; placeholder: string; icon: any }) => {
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
            const filtered = primeDestinations.filter(dest => dest.toLowerCase().includes(inputValue.toLowerCase()));
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    return (
        <div className="relative w-full h-full" ref={containerRef}>
            <div className="flex items-center h-full px-3 gap-2 bg-white/5 group-focus-within:bg-white/10 transition-colors border-r border-white/5 last:border-r-0">
                <Icon className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    className="bg-transparent text-white placeholder:text-white/40 border-0 rounded-none focus-visible:ring-0 h-full p-0 text-xs font-bold"
                    autoComplete="off"
                />
            </div>
            {showSuggestions && (
                <div className="absolute z-[100] left-0 right-0 top-full bg-slate-900 border border-white/10 rounded-b-xl shadow-2xl mt-1 overflow-hidden backdrop-blur-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="p-3 hover:bg-white/10 cursor-pointer text-white text-[11px] border-b border-white/5 last:border-0" onMouseDown={() => { onChange(suggestion); setShowSuggestions(false); }}>
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export function JetSeatQuickSearch() {
    const router = useRouter();
    const firestore = useFirestore();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [pax, setPax] = useState('1');
    const [isSearching, setIsSearching] = useState(false);

    const { data: results } = useCollection<EmptyLeg>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock) return null;
            return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Published', 'Approved', 'live']));
        }, [firestore]),
        'emptyLegs'
    );

    const filteredResults = results?.filter(leg => {
        if (!isSearching) return false;
        const matchesOrigin = !origin || leg.departure.toLowerCase().includes(origin.toLowerCase());
        const matchesDest = !destination || leg.arrival.toLowerCase().includes(destination.toLowerCase());
        const matchesPax = leg.availableSeats >= parseInt(pax);
        return matchesOrigin && matchesDest && matchesPax;
    }) || [];

    const handleSearch = () => {
        setIsSearching(true);
    };

    const getSeatColor = (count: number) => {
        if (count >= 5) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        if (count >= 2) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-xl lg:h-12 overflow-hidden shadow-2xl relative z-30">
                <AutocompleteInput placeholder="Origin Terminal" value={origin} onChange={setOrigin} icon={MapPin} />
                <AutocompleteInput placeholder="Destination Terminal" value={destination} onChange={setDestination} icon={Target} />
                
                <div className="flex items-center h-12 lg:h-full px-3 gap-2 bg-white/5 border-r border-white/5 min-w-[130px]">
                    <Calendar className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-transparent text-white border-0 focus-visible:ring-0 p-0 text-[11px] font-bold" style={{ colorScheme: 'dark' }} />
                </div>

                <div className="flex items-center h-12 lg:h-full px-3 gap-2 bg-white/5 min-w-[80px]">
                    <Users className="h-3.5 w-3.5 text-accent/60 shrink-0" />
                    <Input type="number" min="1" value={pax} onChange={e => setPax(e.target.value)} className="bg-transparent text-white border-0 focus-visible:ring-0 p-0 text-xs font-bold text-center" />
                </div>

                <Button onClick={handleSearch} className="h-12 lg:h-full lg:rounded-none bg-accent text-accent-foreground hover:bg-accent/90 px-6 font-black uppercase text-[10px] tracking-widest gap-2 shrink-0">
                    Search <ArrowRight className="h-3.5 w-3.5" />
                </Button>
            </div>

            {isSearching && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 relative z-20">
                    {filteredResults.length > 0 ? filteredResults.map((leg) => (
                        <div key={leg.id} className="p-4 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 hover:border-accent/30 transition-all flex flex-col gap-3 group">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-[8px] uppercase tracking-[0.2em] font-black text-accent/60 border-white/10 group-hover:text-accent transition-colors">
                                    {leg.aircraftType}
                                </Badge>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">Live Exchange</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-xs font-black text-white uppercase tracking-tight">{leg.departure.split(' (')[0]} → {leg.arrival.split(' (')[0]}</p>
                                <div className="flex items-center gap-3 text-[9px] text-white/40 font-bold uppercase tracking-tighter">
                                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(leg.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /> {new Date(leg.departureTime).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div className="space-y-0.5">
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Value</p>
                                    <p className="text-sm font-black text-accent">₹ {(leg.pricePerSeat || 45000).toLocaleString()}</p>
                                </div>
                                <Badge variant="outline" className={cn("h-5 text-[8px] font-black uppercase border-none px-1.5", getSeatColor(leg.availableSeats))}>
                                    {leg.availableSeats} LEFT
                                </Badge>
                            </div>

                            <Button onClick={() => router.push('/login')} className="w-full bg-white/5 hover:bg-accent hover:text-black text-white h-8 text-[9px] font-black uppercase tracking-widest transition-all mt-1">
                                Initialize Booking <Zap className="h-2.5 w-2.5 ml-1.5" />
                            </Button>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.02]">
                            <Armchair className="h-8 w-8 mx-auto text-muted-foreground/20 mb-3" />
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">No sector matches identified</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}