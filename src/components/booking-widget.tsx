'use client';

import { useState } from 'react';
import { Plane, Ship } from 'lucide-react';
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


export function BookingWidget() {
  const [tripType, setTripType] = useState('oneway');

  const handleTripTypeChange = (type: string) => {
      setTripType(type);
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-black/25 backdrop-blur-md rounded-lg border border-white/20">
        <Tabs defaultValue="jet" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 mb-6">
                <TabsTrigger value="jet" className="text-white/70 data-[state=active]:text-white data-[state=active]:shadow-none p-3 border-b-2 border-transparent data-[state=active]:border-white rounded-none flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                    <Plane /> JET
                </TabsTrigger>
                <TabsTrigger value="helicopter" className="text-white/70 data-[state=active]:text-white data-[state=active]:shadow-none p-3 border-b-2 border-transparent data-[state=active]:border-white rounded-none flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                    <Helicopter /> HELICOPTER
                </TabsTrigger>
                <TabsTrigger value="yacht" className="text-white/70 data-[state=active]:text-white data-[state=active]:shadow-none p-3 border-b-2 border-transparent data-[state=active]:border-white rounded-none flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg">
                    <Ship /> YACHT
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

                    <div className="flex flex-col lg:flex-row bg-white rounded-lg overflow-hidden shadow-lg">
                        <Input placeholder="Origin" className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-gray-800 flex-grow" />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200"></div>
                        <Input placeholder="Destination" className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-gray-800 flex-grow" />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200"></div>
                        <Input type="text" placeholder="Date & Time" onFocus={(e) => e.target.type='datetime-local'} onBlur={(e) => e.target.type='text'} className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-gray-800 flex-grow" />
                        <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200"></div>
                        {tripType === 'round' && (
                            <>
                                <Input type="text" placeholder="Add A Return Flight" onFocus={(e) => e.target.type='datetime-local'} onBlur={(e) => e.target.type='text'} className="border-0 focus-visible:ring-0 rounded-none p-4 text-sm sm:text-base text-gray-800 flex-grow" />
                                <div className="h-px w-full lg:h-auto lg:w-px bg-gray-200"></div>
                            </>
                        )}
                        <div className="p-4 whitespace-nowrap flex items-center justify-center text-sm sm:text-base text-gray-600 flex-grow">1 Passenger</div>
                        <Button className="rounded-none text-base sm:text-lg h-auto p-4 w-full lg:w-auto">Request Pricing</Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="helicopter"><p className="text-center p-12 text-lg text-white">Helicopter booking functionality coming soon.</p></TabsContent>
            <TabsContent value="yacht"><p className="text-center p-12 text-lg text-white">Yacht booking functionality coming soon.</p></TabsContent>
        </Tabs>
    </div>
  );
}
