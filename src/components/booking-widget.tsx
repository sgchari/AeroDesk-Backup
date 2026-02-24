
'use client';

import { useState, useRef } from 'react';
import { Plane, Plus, X, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const HelicopterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.24 3.92c-1.34.03-4.38.33-5.93 1.25-.61.36-1.07.89-1.3 1.55-.4 1.16.23 2.25.23 2.25l1.63.73c.19.08.39.13.59.13.56 0 1.05-.33 1.28-.84l.26-.56L10 7.39v.01l.01-.01c.23-.52.72-.85 1.28-.85h.01c.56 0 1.05.33 1.28.84l.01.01v-.01l1.81 1.04.26.56c.23.51.72.84 1.28.84.2 0 .4-.05.59-.13l1.63-.73s.63-1.09.23-2.25c-.23-.66-.69-1.19-1.3-1.55-1.55-.92-4.59-1.22-5.93-1.25zM5.33 11.22l-.12.05c-1.17.52-2.12 1.55-2.2 2.87-.08 1.41.69 2.68 1.96 2.86 1.02.14 1.9-.36 2.45-1.15l.39-.56-2.48-1.09zM19.03 16.85c.55.79 1.43 1.29 2.45 1.15 1.27-.18 2.04-1.45 1.96-2.86-.08-1.32-1.03-2.35-2.2-2.87l-.12-.05-2.48 1.09.39.56z"/>
        <path d="M14.29 11.11c-.82.1-1.68.16-2.29.16s-1.47-.06-2.29-.16L5.15 12.9a3.89 3.89 0 0 0-1.48 3.25c0 1.94 1.41 3.56 3.28 3.82.9.12 1.76-.17 2.44-.76l2.6-2.35 2.6 2.35c.68.59 1.54.88 2.44.76 1.87-.26 3.28-1.88 3.28-3.82 0-1.33-.69-2.53-1.48-3.25L14.29 11.11z"/>
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

        if (inputValue.length >= 2) {
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
        inputRef.current?.blur();
    };

    return (
        <div className="relative w-full h-full">
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value.length >= 2) {
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
                    setTimeout(() => setShowSuggestions(false), 150);
                }}
                className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-black/80 border border-white/20 rounded-b-md -mt-1 shadow-lg max-h-60 overflow-y-auto backdrop-blur-lg">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-3 hover:bg-white/20 cursor-pointer text-white text-sm"
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

  const removeLeg = (id: number) => {
    setLegs(legs.filter((leg) => leg.id !== id));
  };


  return (
    <div className="p-4 rounded-lg shadow-2xl border border-white/10 max-w-4xl mx-auto bg-black/20 backdrop-blur-md">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0 mb-6">
                 <TabsTrigger value="jet" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <Plane className="h-10 w-10" />
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <HelicopterIcon className="h-10 w-10" />
                </TabsTrigger>
                <TabsTrigger value="seats" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <Armchair className="h-10 w-10" />
                </TabsTrigger>
            </TabsList>
            <TabsContent value="jet" className="mt-0">
                <div className="space-y-4">
                    <RadioGroup value={tripType} onValueChange={setTripType} className="flex items-center justify-center gap-4 sm:gap-6 mt-2 mb-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneway" id="oneway" className='text-accent border-accent' />
                            <Label htmlFor="oneway" className="text-white cursor-pointer text-sm sm:text-base">
                                Oneway
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="round" id="round" className='text-accent border-accent' />
                            <Label htmlFor="round" className="text-white cursor-pointer text-sm sm:text-base">
                                Round
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multicity" id="multicity" className='text-accent border-accent' />
                            <Label htmlFor="multicity" className="text-white cursor-pointer text-sm sm:text-base">
                                Multicity
                            </Label>
                        </div>
                    </RadioGroup>
                    
                    {tripType === 'oneway' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-px rounded-md overflow-hidden border border-white/10">
                                <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" />
                            </div>
                        </div>
                    )}
                    
                    {tripType === 'round' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-md overflow-hidden border border-white/10">
                                <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px rounded-md overflow-hidden border border-white/10">
                                <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Departure Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Departure Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Return Date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Return Time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                            </div>
                        </div>
                    )}

                    {tripType === 'multicity' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                {legs.map((leg) => (
                                    <div key={leg.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-px items-stretch rounded-md overflow-hidden border border-white/10">
                                        <AutocompleteInput placeholder="Origin" value={leg.origin} onChange={(val) => handleLegChange(leg.id, 'origin', val)} />
                                        <AutocompleteInput placeholder="Destination" value={leg.destination} onChange={(val) => handleLegChange(leg.id, 'destination', val)} />
                                        <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={leg.departureDate} onChange={(e) => handleLegChange(leg.id, 'departureDate', e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                        <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={leg.departureTime} onChange={(e) => handleLegChange(leg.id, 'departureTime', e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'dark'}} />
                                        <div className="flex items-center justify-center bg-transparent">
                                            {legs.length > 1 && (
                                                <Button variant="ghost" size="icon" onClick={() => removeLeg(leg.id)} className="text-destructive h-full w-full rounded-none hover:bg-destructive/10">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20" onClick={addLeg}>
                                    <Plus className="mr-2 h-4 w-4" /> Add another flight
                                </Button>
                            </div>
                            <div className="grid grid-cols-1">
                                <Input 
                                    type="number"
                                    placeholder="Passengers"
                                    value={passengers} 
                                    onChange={e => setPassengers(e.target.value)}
                                    className="bg-transparent border border-white/10 text-white placeholder:text-white/70 rounded-md h-full text-center"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-center pt-2">
                        <Button variant="accent" className="rounded-md px-4">SEARCH</Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-white">Helicopter booking functionality coming soon.</p></TabsContent>
            <TabsContent value="seats"><p className="text-center p-12 text-lg text-white">Seat reservation functionality coming soon.</p></TabsContent>
        </Tabs>
    </div>
  );
}


    
