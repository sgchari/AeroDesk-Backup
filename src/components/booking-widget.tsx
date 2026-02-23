
'use client';

import { useState, useRef } from 'react';
import { Plane, Armchair, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const HelicopterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M2 12C2 12 4.5 10 9 10C13.5 10 16.5 12 16.5 12C16.5 12 15.5 15 12 15C8.5 15 2 12 2 12Z" />
        <path d="M10 10V3L14 3" />
        <path d="M7 3H17" />
        <path d="M16 12L22 10" />
        <path d="M20 10V8" />
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
                <div className="absolute z-50 w-full bg-black/50 border border-white/20 rounded-b-md -mt-1 shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
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
  const [activeTab, setActiveTab] = useState('jet');
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
    <div className="w-full max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex items-center justify-center bg-transparent p-0 rounded-t-lg mx-auto mb-6 border-b-0">
                <TabsTrigger value="jet" asChild>
                    <Button variant="ghost" className="p-2 text-white/70 bg-transparent hover:text-accent data-[state=active]:text-accent transition-all">
                        <Plane className="h-10 w-10" />
                    </Button>
                </TabsTrigger>
                <TabsTrigger value="helicopter" asChild>
                    <Button variant="ghost" className="p-2 text-white/70 bg-transparent hover:text-accent data-[state=active]:text-accent transition-all">
                        <HelicopterIcon className="h-10 w-10" />
                    </Button>
                </TabsTrigger>
                <TabsTrigger value="seats" asChild>
                    <Button variant="ghost" className="p-2 text-white/70 bg-transparent hover:text-accent data-[state=active]:text-accent transition-all">
                        <Armchair className="h-10 w-10" />
                    </Button>
                </TabsTrigger>
            </TabsList>
            
            <div className="bg-black/30 p-4 rounded-lg shadow-2xl border border-white/10 backdrop-blur-md">
                <TabsContent value="jet" className="mt-0">
                    <div className="space-y-4">
                        <RadioGroup value={tripType} onValueChange={setTripType} className="flex items-center justify-center gap-4 sm:gap-6 mt-2 mb-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="oneway" id="oneway" className='text-accent border-accent' />
                                <Label htmlFor="oneway" className="text-foreground cursor-pointer text-sm sm:text-base">
                                    Oneway
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="round" id="round" className='text-accent border-accent' />
                                <Label htmlFor="round" className="text-foreground cursor-pointer text-sm sm:text-base">
                                    Round
                                </Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="multicity" id="multicity" className='text-accent border-accent' />
                                <Label htmlFor="multicity" className="text-foreground cursor-pointer text-sm sm:text-base">
                                    Multicity
                                </Label>
                            </div>
                        </RadioGroup>
                        
                        {tripType === 'oneway' && (
                             <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-px rounded-md overflow-hidden bg-white/20 backdrop-blur-sm">
                                    <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                    <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                    <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                    <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                    <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" />
                                </div>
                            </div>
                        )}
                        
                        {tripType === 'round' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-md overflow-hidden bg-white/20 backdrop-blur-sm">
                                    <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                    <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                    <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-px rounded-md overflow-hidden bg-white/20 backdrop-blur-sm">
                                    <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Departure Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                    <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Departure Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                    <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Return Date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                    <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Return Time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                </div>
                            </div>
                        )}

                        {tripType === 'multicity' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    {legs.map((leg) => (
                                        <div key={leg.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-px items-stretch rounded-md overflow-hidden bg-white/20 backdrop-blur-sm">
                                            <AutocompleteInput placeholder="Origin" value={leg.origin} onChange={(val) => handleLegChange(leg.id, 'origin', val)} />
                                            <AutocompleteInput placeholder="Destination" value={leg.destination} onChange={(val) => handleLegChange(leg.id, 'destination', val)} />
                                            <Input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Date" value={leg.departureDate} onChange={(e) => handleLegChange(leg.id, 'departureDate', e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
                                            <Input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} placeholder="Time" value={leg.departureTime} onChange={(e) => handleLegChange(leg.id, 'departureTime', e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" style={{colorScheme: 'light'}} />
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
                                        className="bg-white/20 text-white placeholder:text-white/70 rounded-md h-full text-center backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                        )}
                        
                         <div className="flex justify-center pt-2">
                            <Button variant="accent" className="rounded-md px-4">SEARCH</Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-foreground">Helicopter booking functionality coming soon.</p></TabsContent>
                <TabsContent value="seats"><p className="text-center p-12 text-lg text-foreground">Seat reservation functionality coming soon.</p></TabsContent>
            </div>
        </Tabs>
    </div>
  );
}
