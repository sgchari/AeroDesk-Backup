'use client';

import { useState, useRef } from 'react';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';


const Helicopter = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
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
    "Ahmedabad (AMD)",
    "Amritsar (ATQ)",
    "Bagdogra (IXB)",
    "Bengaluru (BLR)",
    "Bhubaneswar (BBI)",
    "Chandigarh (IXC)",
    "Chennai (MAA)",
    "Cochin (COK)",
    "Coimbatore (CJB)",
    "Delhi (DEL)",
    "Goa (GOI)",
    "Guwahati (GAU)",
    "Hyderabad (HYD)",
    "Imphal (IMF)",
    "Indore (IDR)",
    "Jaipur (JAI)",
    "Kolkata (CCU)",
    "Lucknow (LKO)",
    "Madurai (IXM)",
    "Mangalore (IXE)",
    "Mumbai (BOM)",
    "Nagpur (NAG)",
    "Pune (PNQ)",
    "Port Blair (IXZ)",
    "Srinagar (SXR)",
    "Thiruvananthapuram (TRV)",
    "Tiruchirappalli (TRZ)",
    "Varanasi (VNS)",
    "Visakhapatnam (VTZ)",
    "Dubai (DXB)",
    "London (LHR)",
    "New York (JFK)",
    "Singapore (SIN)",
];

const AutocompleteInput = ({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue); // Update parent state

        if (inputValue.length >= 3) {
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
        <div className="relative w-full">
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value.length >= 3) {
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
                    // Delay hiding suggestions to allow click event
                    setTimeout(() => {
                        setShowSuggestions(false);
                    }, 150);
                }}
                className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-foreground w-full"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-b-lg -mt-1 shadow-lg max-h-60 overflow-y-auto">
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

  const handleTripTypeChange = (type: string) => {
      setTripType(type);
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-black/25 backdrop-blur-md rounded-lg border border-white/20">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 mb-6 gap-2">
                <TabsTrigger value="jet" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg p-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                    <Plane /> JET
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg p-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                    <Helicopter /> HELICOPTER
                </TabsTrigger>
            </TabsList>

            <TabsContent value="jet">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                             <Checkbox id="oneway" checked={tripType === 'oneway'} onCheckedChange={() => handleTripTypeChange('oneway')} className="h-4 w-4 rounded-sm border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <Label htmlFor="oneway" className="text-white text-sm sm:text-base">Oneway</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                             <Checkbox id="round" checked={tripType === 'round'} onCheckedChange={() => handleTripTypeChange('round')} className="h-4 w-4 rounded-sm border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <Label htmlFor="round" className="text-white text-sm sm:text-base">Round</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Checkbox id="multicity" checked={tripType === 'multicity'} onCheckedChange={() => handleTripTypeChange('multicity')} className="h-4 w-4 rounded-sm border-white data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                            <Label htmlFor="multicity" className="text-white text-sm sm:text-base">Multicity</Label>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-lg items-center">
                        <AutocompleteInput placeholder="Origin" value={origin} onChange={setOrigin} />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200 self-stretch"></div>
                        <AutocompleteInput placeholder="Destination" value={destination} onChange={setDestination} />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200 self-stretch"></div>
                        <Input type="text" placeholder="Date & Time" onFocus={(e) => e.target.type='datetime-local'} onBlur={(e) => e.target.type='text'} className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-foreground w-full" />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200 self-stretch"></div>
                        {tripType === 'round' && (
                            <>
                                <Input type="text" placeholder="Add A Return Flight" onFocus={(e) => e.target.type='datetime-local'} onBlur={(e) => e.target.type='text'} className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-foreground w-full" />
                                <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200 self-stretch"></div>
                            </>
                        )}
                        <Input type="number" placeholder="Passengers" min="1" className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-foreground w-full lg:w-48" />
                        <Button className="rounded-none text-base sm:text-lg h-auto p-4 w-full lg:w-auto self-stretch">Request Pricing</Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-white">Helicopter booking functionality coming soon.</p></TabsContent>
        </Tabs>
    </div>
  );
}
