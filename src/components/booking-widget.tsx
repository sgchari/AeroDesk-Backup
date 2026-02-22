
'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, Armchair, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';


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
        onChange(inputValue); // Update parent state

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
                    // Delay hiding suggestions to allow click event
                    setTimeout(() => {
                        setShowSuggestions(false);
                    }, 150);
                }}
                className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full h-full bg-transparent text-center"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-b-lg -mt-1 shadow-lg max-h-60 overflow-y-auto">
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
  const [legs, setLegs] = useState([{ origin: '', destination: '', date: '', time: '' }]);
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [passengers, setPassengers] = useState('1');


  const handleTripTypeChange = (type: string) => {
      setTripType(type);
  }

  const addLeg = () => {
    setLegs(currentLegs => {
        const lastDestination = currentLegs[currentLegs.length - 1]?.destination || '';
        return [...currentLegs, { origin: lastDestination, destination: '', date: '', time: '' }];
    });
  };

  useEffect(() => {
    if (tripType === 'multicity') {
        if (legs.length === 1) {
            addLeg();
        }
    } else {
        if (legs.length > 1) {
            setLegs(currentLegs => currentLegs.slice(0, 1));
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripType]);


  const updateLeg = (index: number, field: 'origin' | 'destination' | 'date' | 'time', value: string) => {
    const newLegs = [...legs];
    newLegs[index][field] = value;
    
    if (tripType === 'multicity' && field === 'destination' && index < newLegs.length - 1) {
      newLegs[index + 1].origin = value;
    }
    
    setLegs(newLegs);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4 sm:p-6">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="flex justify-center bg-transparent p-0 rounded-lg max-w-md mx-auto">
                <TabsTrigger value="jet" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg p-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Plane /> JET
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg p-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base">
                    <Helicopter /> HELICOPTER
                </TabsTrigger>
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <TabsTrigger value="seats" className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-primary/80 data-[state=active]:shadow-lg p-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base">
                                <Armchair /> RESERVE SEATS
                            </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Access seats on select private jet flights operating on predefined routes</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </TabsList>

            <TabsContent value="jet" className="mt-6">
                <div className="space-y-6">
                    <RadioGroup value={tripType} onValueChange={handleTripTypeChange} className="flex items-center justify-center gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="oneway" id="oneway" className="border-white" />
                            <Label htmlFor="oneway" className="text-white text-sm sm:text-base">Oneway</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="round" id="round" className="border-white" />
                            <Label htmlFor="round" className="text-white text-sm sm:text-base">Round</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multicity" id="multicity" className="border-white" />
                            <Label htmlFor="multicity" className="text-white text-sm sm:text-base">Multicity</Label>
                        </div>
                    </RadioGroup>

                    <div className="flex flex-col border border-white/20 rounded-lg">
                        {tripType === 'multicity' ? (
                            <>
                                <div className="flex-1 flex flex-col">
                                    {legs.map((leg, index) => (
                                        <div key={index} className={cn("flex flex-col sm:flex-row items-stretch", index > 0 && "border-t border-white/20")}>
                                            <div className='flex-1'>
                                                <AutocompleteInput placeholder={`Leg ${index + 1} Origin`} value={leg.origin} onChange={(v) => updateLeg(index, 'origin', v)} />
                                            </div>
                                            <div className="h-px w-full sm:h-auto sm:w-px bg-white/20 self-stretch"></div>
                                            <div className='flex-1'>
                                                <AutocompleteInput placeholder={`Leg ${index + 1} Destination`} value={leg.destination} onChange={(v) => updateLeg(index, 'destination', v)} />
                                            </div>
                                            <div className="h-px w-full sm:h-auto sm:w-px bg-white/20 self-stretch"></div>
                                            <div className='flex-1'>
                                                <Input type="date" value={leg.date} onChange={(e) => updateLeg(index, 'date', e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center"/>
                                            </div>
                                            <div className="h-px w-full sm:h-auto sm:w-px bg-white/20 self-stretch"></div>
                                            <div className='flex-1'>
                                                 <Input type="time" value={leg.time} onChange={(e) => updateLeg(index, 'time', e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col lg:flex-row items-stretch border-t border-white/20">
                                    <div className="flex w-full">
                                        <Input type="number" placeholder="Passengers" min="1" value={passengers} onChange={e => setPassengers(e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full lg:w-48 bg-transparent text-center" />
                                        <Button className="w-full lg:w-auto rounded-none flex-1 lg:flex-none">Request Pricing</Button>
                                    </div>
                                </div>
                                 <div className="p-2 bg-gray-50/10 border-t border-white/20">
                                    <Button variant="link" size="sm" onClick={addLeg} className="text-primary gap-2">
                                        <Plus className="h-4 w-4"/>
                                        Add another flight
                                    </Button>
                                </div>
                            </>
                        ) : (
                            // Oneway & Roundtrip layout
                            <div className="flex flex-col lg:flex-row items-stretch">
                                <div className="flex-1">
                                    <AutocompleteInput placeholder="Origin" value={legs[0].origin} onChange={(v) => updateLeg(0, 'origin', v)} />
                                </div>
                                <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                <div className="flex-1">
                                    <AutocompleteInput placeholder="Destination" value={legs[0].destination} onChange={(v) => updateLeg(0, 'destination', v)} />
                                </div>
                                <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                <div className="flex-1">
                                    <Input type="date" placeholder="Date" value={legs[0].date} onChange={(e) => updateLeg(0, 'date', e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center"/>
                                </div>
                                <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                <div className="flex-1">
                                    <Input type="time" placeholder="Time" value={legs[0].time} onChange={(e) => updateLeg(0, 'time', e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center"/>
                                </div>
                                
                                {tripType === 'round' && (
                                    <>
                                        <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                        <div className="flex-1">
                                            <Input type="date" placeholder="Return Date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center" />
                                        </div>
                                        <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                        <div className="flex-1">
                                            <Input type="time" placeholder="Return Time" value={returnTime} onChange={e => setReturnTime(e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 w-full bg-transparent h-full text-center" />
                                        </div>
                                    </>
                                )}

                                <div className="h-px w-full lg:h-auto lg:w-px bg-white/20 self-stretch"></div>
                                <div className="flex w-full lg:w-auto">
                                    <Input type="number" placeholder="Passengers" min="1" value={passengers} onChange={e => setPassengers(e.target.value)} className="border-0 focus-visible:ring-0 text-white placeholder:text-white/70 lg:w-36 bg-transparent text-center"/>
                                    <Button className="w-full lg:w-auto rounded-none flex-1 lg:flex-none">Request Pricing</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-white">Helicopter booking functionality coming soon.</p></TabsContent>
            <TabsContent value="seats"><p className="text-center p-12 text-lg text-white">Seat reservation functionality coming soon.</p></TabsContent>
        </Tabs>
    </div>
  );
}
