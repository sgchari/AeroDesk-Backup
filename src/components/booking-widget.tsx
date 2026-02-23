
'use client';

import { useState, useRef } from 'react';
import { Plane, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const HelicopterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <path d="M12 2C6.48 2 2 2.45 2 3s4.48 1 10 1s10-.45 10-1s-4.48-1-10-1zm0 4.75c-.69 0-1.25-.56-1.25-1.25V3.5c0-.69.56-1.25 1.25-1.25s1.25.56 1.25 1.25v2.01c0 .68-.56 1.24-1.25 1.24zm8.23-1.28c-.52-.2-1.1.08-1.3.6s.08 1.1.6 1.3l-2.67 1.07c-.43-1.8-1.66-3.33-3.36-4.2V7.25c0-.41-.34-.75-.75-.75s-.75.34-.75.75v1.07C9.34 9.8 6.66 12.63 6.04 16H3.75c-.41 0-.75.34-.75.75s.34.75.75.75h2.5c.09 0 .17-.01.25-.03.04.1.08.19.14.28H5.75c-.41 0-.75.34-.75.75s.34.75.75.75h1.72c1.23 1.69 3.14 2.89 5.28 3.23V21.25c0 .41.34.75.75.75s.75-.34.75-.75v-1.51c2.14-.34 4.05-1.54 5.28-3.23h1.72c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-.88c.06-.09.1-.18.14-.28.08.02.16.03.25.03h2.5c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-2.29c-.62-3.37-3.3-6.2-6.64-7.07l2.67-1.07c.52.2 1.1-.08 1.3-.6s-.09-1.1-.61-1.3z"/>
    </svg>
);

const ArmchairIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M22 8v3c0 1.1-.9 2-2 2h-1v2h-2v-2H7v2H5v-2H4c-1.1 0-2-.9-2-2V8c0-1.86 1.28-3.41 3-3.86V2h12v2.14c1.72.45 3 2 3 3.86zM6 11h12V8H6v3z"/>
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
    <div className="bg-black/20 p-4 rounded-lg shadow-2xl border border-white/10 backdrop-blur-sm max-w-4xl mx-auto">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 bg-transparent p-0 mb-6">
                <TabsTrigger value="jet" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <Plane className="h-8 w-8" />
                    <span className="font-semibold text-sm">Private Jet</span>
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <HelicopterIcon className="h-8 w-8" />
                    <span className="font-semibold text-sm">Helicopter</span>
                </TabsTrigger>
                <TabsTrigger value="seats" className="flex flex-col gap-2 p-3 rounded-lg h-auto border-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-accent/20 text-white/80 data-[state=active]:text-white hover:bg-white/10">
                    <ArmchairIcon className="h-8 w-8" />
                    <span className="font-semibold text-sm">Seats</span>
                </TabsTrigger>
            </TabsList>
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
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-px rounded-md overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
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
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-md overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
                                <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                                <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                                <Input type="number" placeholder="Passengers" value={passengers} onChange={e => setPassengers(e.target.value)} className="bg-transparent text-white placeholder:text-white/70 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-px rounded-md overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
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
                                    <div key={leg.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-px items-stretch rounded-md overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
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
                                    className="bg-black/30 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/70 rounded-md h-full text-center"
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
        </Tabs>
    </div>
  );
}

    