
'use client';

import { useState, useRef } from 'react';
import { Plane, Armchair } from 'lucide-react';
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
                className="bg-white text-black placeholder:text-gray-500 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-b-md -mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-3 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
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
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('');

  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl shadow-lg p-4 bg-black/30 border border-white/10">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="flex justify-center sm:justify-start bg-transparent p-0 rounded-lg max-w-md mx-auto sm:mx-0 mb-6 gap-2 sm:gap-4">
                <TabsTrigger value="jet" className="flex-row items-center gap-2 rounded-md px-4 py-2 text-sm sm:text-base text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all">
                    <Plane className="h-5 w-5" /> JET
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="flex-row items-center gap-2 rounded-md px-4 py-2 text-sm sm:text-base text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all">
                    <HelicopterIcon className="h-5 w-5" /> HELICOPTER
                </TabsTrigger>
                 <TabsTrigger value="seats" className="flex-row items-center gap-2 rounded-md px-4 py-2 text-sm sm:text-base text-white/80 hover:text-white hover:bg-white/10 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all">
                    <Armchair className="h-5 w-5" /> RESERVE SEATS
                </TabsTrigger>
            </TabsList>

            <TabsContent value="jet" className="mt-2">
                <div className="space-y-5">
                    <RadioGroup value={tripType} onValueChange={setTripType} className="flex items-center justify-center gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneway" id="oneway" className="sr-only" />
                            <Label htmlFor="oneway" className="flex items-center gap-2 text-white cursor-pointer text-sm sm:text-base">
                                <span className={cn("h-3 w-3 flex items-center justify-center rounded-full border-2 border-white", tripType === 'oneway' && 'border-accent')}>
                                     {tripType === 'oneway' && <span className='h-1.5 w-1.5 rounded-full bg-accent' />}
                                </span>
                                Oneway
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="round" id="round" className="sr-only" />
                             <Label htmlFor="round" className="flex items-center gap-2 text-white cursor-pointer text-sm sm:text-base">
                                 <span className={cn("h-3 w-3 flex items-center justify-center rounded-full border-2 border-white", tripType === 'round' && 'border-accent')}>
                                     {tripType === 'round' && <span className='h-1.5 w-1.5 rounded-full bg-accent' />}
                                 </span>
                                Round
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                             <RadioGroupItem value="multicity" id="multicity" className="sr-only" disabled />
                             <Label htmlFor="multicity" className="flex items-center gap-2 text-white/50 cursor-not-allowed text-sm sm:text-base">
                                 <span className="h-3 w-3 flex items-center justify-center rounded-full border-2 border-white/50"></span>
                                Multicity
                            </Label>
                        </div>
                    </RadioGroup>

                    <div className="flex flex-col md:flex-row items-stretch rounded-md overflow-hidden">
                         <div className="flex-1 border-r border-gray-300">
                             <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                         </div>
                         <div className="flex-1 border-r border-gray-300">
                             <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                         </div>
                        <div className="relative flex-1 border-r border-gray-300">
                            <Input 
                                type="text"
                                onFocus={(e) => { e.target.type = 'date'; }}
                                onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                                placeholder="Date"
                                value={departureDate} 
                                onChange={(e) => setDepartureDate(e.target.value)} 
                                className="bg-white text-black placeholder:text-gray-500 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3"
                                style={{colorScheme: 'light'}}
                            />
                             {!departureDate && <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>Date</span>}
                        </div>
                        
                        {tripType === 'round' ? (
                             <div className="relative flex-1 border-r border-gray-300">
                                <Input 
                                    type="text"
                                    onFocus={(e) => { e.target.type = 'date'; }}
                                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                                    placeholder="Add A Return Flight"
                                    value={returnDate} 
                                    onChange={e => setReturnDate(e.target.value)} 
                                    className="bg-white text-black placeholder:text-gray-500 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3"
                                    style={{colorScheme: 'light'}}
                                />
                                {!returnDate && <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>Return Date</span>}
                            </div>
                        ) : (
                             <Input 
                                type="text"
                                placeholder="Add A Return Flight"
                                value=""
                                onFocus={() => setTripType('round')}
                                className="bg-white text-black placeholder:text-gray-400 border-0 border-r border-gray-300 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center flex-1 py-3 cursor-pointer"
                                readOnly
                            />
                        )}

                        <div className="relative flex-1">
                            <Input 
                                type="text"
                                placeholder="1 Passenger"
                                value={passengers} 
                                onChange={e => setPassengers(e.target.value)}
                                onFocus={(e) => { e.target.type = 'number'; e.target.placeholder='1'; e.target.min='1'; }} onBlur={(e) => { if (!e.target.value) {e.target.type = 'text'; e.target.placeholder='1 Passenger'}}}
                                className="bg-white text-black placeholder:text-gray-500 border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-center w-full h-full py-3"
                            />
                             {!passengers && <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'>Passengers</span>}
                        </div>
                        <Button variant="primary" className="rounded-none text-lg h-auto px-8">SEARCH</Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-white">Helicopter booking functionality coming soon.</p></TabsContent>
            <TabsContent value="seats"><p className="text-center p-12 text-lg text-white">Seat reservation functionality coming soon.</p></TabsContent>
        </Tabs>
    </div>
  );
}
