
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Operator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Zone = 'North' | 'South' | 'East' | 'West' | 'Central';

const zoneStyles: Record<Zone, string> = {
    North: 'top-[10%] left-[35%] w-[30%] h-[30%]',
    West: 'top-[35%] left-[5%] w-[30%] h-[30%]',
    Central: 'top-[40%] left-[35%] w-[30%] h-[30%]',
    East: 'top-[35%] right-[5%] w-[30%] h-[30%]',
    South: 'bottom-[5%] left-[30%] w-[40%] h-[30%]',
};

const operatorPositions: Record<string, { top: string; left: string }> = {
    // North
    'Delhi': { top: '30%', left: '50%' },
    'Jaipur': { top: '35%', left: '40%' },
    // West
    'Mumbai': { top: '50%', left: '20%' },
    'Ahmedabad': { top: '40%', left: '25%' },
    'Pune': { top: '55%', left: '25%' },
    // South
    'Bengaluru': { top: '70%', left: '50%' },
    'Hyderabad': { top: '60%', left: '55%' },
    'Chennai': { top: '80%', left: '60%' },
    // East
    'Kolkata': { top: '40%', left: '80%' },
    // Central
    'Bhopal': { top: '45%', left: '50%' },
};

const OperatorPin = ({ operator }: { operator: Operator }) => {
    const statusColor = operator.status === 'Approved' ? 'bg-green-500' : 'bg-red-500';
    const position = operator.city ? operatorPositions[operator.city] : { top: '50%', left: '50%' };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className="absolute w-4 h-4 rounded-full"
                    style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
                >
                    <div className={cn("w-full h-full rounded-full animate-pulse", statusColor)} />
                    <div className={cn("absolute inset-0 w-full h-full rounded-full border-2", operator.status === 'Approved' ? 'border-green-400' : 'border-red-400')} />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-bold">{operator.companyName}</p>
                    <p className="text-sm text-muted-foreground">{operator.city}</p>
                    <Badge variant={operator.status === 'Approved' ? 'success' : 'destructive'} className="mt-1">{operator.status}</Badge>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'operators');
    }, [firestore]);
    
    const { data: operators, isLoading } = useCollection<Operator>(operatorsQuery, 'operators');
    
    const approvedOperators = operators?.filter(op => op.status === 'Approved' || op.status === 'Suspended');

    const operatorsByZone = {
        North: approvedOperators?.filter(op => op.zone === 'North') || [],
        South: approvedOperators?.filter(op => op.zone === 'South') || [],
        East: approvedOperators?.filter(op => op.zone === 'East') || [],
        West: approvedOperators?.filter(op => op.zone === 'West') || [],
        Central: approvedOperators?.filter(op => op.zone === 'Central') || [],
    };

  return (
    <div className="w-full">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader activePage="Our Network"/>
        <main className="flex-1 py-12 md:py-16">
          <div className="container">
            <Card className="border-white/10 bg-black/25 backdrop-blur-md text-white w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline text-center">Our Operator Network</CardTitle>
                    <CardDescription className="text-center text-white/80">
                        A view of our approved charter operators across India.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[60vh] flex items-center justify-center">
                    {isLoading ? (
                        <Skeleton className="w-full h-[50vh] bg-white/10" />
                    ) : (
                        <div className="w-full max-w-4xl mx-auto aspect-video relative">
                            {/* Background SVG for India shape - simplified */}
                            <svg viewBox="0 0 273 303" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-white/10">
                                <path d="M123.511 1.76831C113.315 -2.13861 102.26 5.86703 100.83 16.4862L83.0763 158.079C82.8624 159.715 84.1485 161.22 85.8039 161.22H118.814L110.354 225.86C109.914 229.479 112.569 232.597 116.108 232.93L209.689 240.758C231.233 242.548 247.962 260.126 247.332 281.791L245.98 301.768H272.934L266.786 200.701C264.444 167.319 238.455 140.489 205.15 137.601L143.911 132.763L123.511 1.76831Z" fill="currentColor"/>
                                <path d="M141.258 135.549L121.737 2.5191C120.307 -8.09998 102.348 -3.12586 100.274 9.17637L65.1832 209.009C64.0152 215.341 68.618 221.22 75.0515 221.22H103.498L83.8243 287.697C82.0298 296.882 93.189 303.411 100.274 297.027L245.42 181.761L141.258 135.549Z" fill="currentColor"/>
                                <path d="M60.6725 214.39L1.5175 141.979L43.8266 112.433L67.126 137.777L60.6725 214.39Z" fill="currentColor"/>
                            </svg>

                            {(Object.keys(operatorsByZone) as Zone[]).map(zone => (
                                <div key={zone} className={cn('absolute border-2 border-dashed border-white/20 rounded-lg', zoneStyles[zone])}>
                                   <div className="absolute -top-3 left-2 px-2 bg-background text-sm font-bold text-accent">{zone}</div>
                                   {operatorsByZone[zone].map(op => (
                                       <OperatorPin key={op.id} operator={op} />
                                   ))}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
