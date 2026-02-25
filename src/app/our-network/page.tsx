
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
    'Chandigarh': { top: '22%', left: '48%' },
    'Lucknow': { top: '34%', left: '60%' },
    // West
    'Mumbai': { top: '50%', left: '20%' },
    'Ahmedabad': { top: '40%', left: '25%' },
    'Pune': { top: '55%', left: '25%' },
    'Goa': { top: '62%', left: '28%' },
    // South
    'Bengaluru': { top: '70%', left: '50%' },
    'Hyderabad': { top: '60%', left: '55%' },
    'Chennai': { top: '75%', left: '60%' },
    'Cochin': { top: '82%', left: '45%' },
    // East
    'Kolkata': { top: '40%', left: '80%' },
    'Guwahati': { top: '30%', left: '90%' },
    'Bhubaneswar': { top: '48%', left: '75%' },
    // Central
    'Bhopal': { top: '45%', left: '50%' },
    'Nagpur': { top: '52%', left: '56%' },
    'Raipur': { top: '49%', left: '65%' },
    'Indore': { top: '44%', left: '40%' },
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
                            {/* Background SVG for India shape */}
                             <svg viewBox="0 0 500 550" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-white/10">
                                <path d="M228.1,2.5c-2.3-2.3-5.7-3.1-8.7-2.1l-1.1,0.4c-0.1,0-0.1,0.1-0.2,0.1L97.5,52.2c-2.8,1.8-4.6,4.9-4.8,8.2l-4.7,69.5 c-0.1,2.2,0.6,4.4,2,6.1l20.4,25.2c1.7,2.1,2.8,4.7,2.8,7.5v28.8c0,3.3-1.5,6.4-4,8.4l-19.8,15.6c-2,1.6-4.5,2.4-7.1,2.4h-38 c-4.6,0-8.3,3.7-8.3,8.3v27c0,4.6,3.7,8.3,8.3,8.3h19.3c3,0,5.8,1.2,7.9,3.4l27.1,27.1c1.5,1.5,2.4,3.6,2.4,5.7v3.2 c0,1.2-0.5,2.4-1.3,3.3l-13.4,14.6c-1.9,2.1-2.9,4.8-2.7,7.5l2.4,37.3c0.3,4,3.6,7.1,7.6,7.1h13.9c1.9,0,3.8,0.7,5.2,2 l14.3,13.8c2.1,2.1,5,3.2,8,3.2h15.9c3.3,0,6.4-1.3,8.7-3.6l45.4-45.4c2.3-2.3,3.6-5.4,3.6-8.7v-21.7c0-2.2-0.9-4.4-2.5-5.9 l-10.1-10.1c-1.6-1.6-2.5-3.8-2.5-5.9V340c0-3-1.2-5.8-3.4-7.9L161,299.5c-2.1-2.1-3.4-5-3.4-8v-10.8c0-3,1.2-5.8,3.4-7.9 l19.4-19.4c2.1-2.1,3.4-5,3.4-8v-11.8c0-1.7-0.7-3.4-1.9-4.6L158,206.1c-1.6-1.6-3.8-2.5-5.9-2.5h-10.1c-4.6,0-8.3-3.7-8.3-8.3 v-11.8c0-3,1.2-5.8,3.4-7.9l36.5-36.5c2.1-2.1,5-3.4,8-3.4h11.8c3,0,5.8,1.2,7.9,3.4l29.4,29.4c1,1,2.4,1.6,3.8,1.6h17.9 c2.1,0,4-0.8,5.5-2.2l30.4-30.4c2.3-2.3,5.4-3.6,8.7-3.6h25.4c4.6,0,8.3,3.7,8.3,8.3v13.6c0,2.1-0.8,4-2.2,5.5l-19.3,19.3 c-1.5,1.5-2.2,3.5-2.2,5.5v19.4c0,4.6,3.7,8.3,8.3,8.3h10c3,0,5.8,1.2,7.9,3.4l27.1,27.1c2.1,2.1,3.4,5,3.4,8V281 c0,4.6-3.7,8.3-8.3,8.3h-10c-3.3,0-6.4,1.3-8.7,3.6L341,338.3c-2.3,2.3-3.6,5.4-3.6,8.7v10c0,3.3,1.3,6.4,3.6,8.7l13.6,13.6 c2.3,2.3,3.6,5.4,3.6,8.7v23.2c0,4.6-3.7,8.3-8.3,8.3h-11.8c-2.8,0-5.4,1.1-7.4,3.1L301,452.4c-2.3,2.3-5.4,3.6-8.7,3.6h-27.6 c-4.6,0-8.3-3.7-8.3-8.3v-11.8c0-3-1.2-5.8-3.4-7.9l-36.5-36.5c-2.1-2.1-5-3.4-8-3.4h-10c-4.6,0-8.3-3.7-8.3-8.3v-10 c0-3.3,1.3-6.4,3.6-8.7l23.2-23.2c2.3-2.3,3.6-5.4,3.6-8.7v-25.4c0-4.6-3.7-8.3-8.3-8.3h-13.6c-3,0-5.8-1.2-7.9-3.4 l-30.4-30.4c-2.3-2.3-5.4-3.6-8.7-3.6h-21.7c-3.3,0-6.4,1.3-8.7,3.6l-21.7,21.7c-2.3,2.3-3.6,5.4-3.6,8.7V340 c0,4.6,3.7,8.3,8.3,8.3h10c3,0,5.8,1.2,7.9,3.4l19.4,19.4c2.1,2.1,3.4,5,3.4,8v11.8c0,4.6-3.7,8.3-8.3,8.3h-10.1 c-2.1,0-4,0.8-5.5,2.2l-23.2,23.2c-1.5,1.5-2.2,3.5-2.2,5.5v19.4c0,3,1.2,5.8,3.4,7.9l27.1,27.1c2.1,2.1,5,3.4,8,3.4h19.3 c4.6,0,8.3,3.7,8.3,8.3v27c0,3.3-1.3,6.4-3.6,8.7L97.9,545.9c-2.3,2.3-3.6,5.4-3.6,8.7V565h209.6l-50.6-50.6 c-2.3-2.3-3.6-5.4-3.6-8.7v-13.6c0-4.6,3.7-8.3,8.3-8.3h10c3,0,5.8-1.2,7.9-3.4l36.5-36.5c2.1-2.1,5-3.4,8-3.4h11.8 c4.6,0,8.3,3.7,8.3,8.3v11.8c0,3-1.2,5.8-3.4,7.9L301,496.6c-2.1-2.1-3.4,5-3.4,8v10.8c0,4.6,3.7,8.3,8.3,8.3h10.1 c2.1,0,4,0.8,5.5,2.2l23.2,23.2c1.5,1.5,2.2,3.5,2.2,5.5v10c0,2.8-1.1,5.4-3.1,7.4L326.4,594c-2,2-3.1,4.7-3.1,7.4V612h27.6 c2.8,0,5.4-1.1,7.4-3.1l31.5-31.5c2-2,3.1-4.7,3.1-7.4v-11.8c0-4.6,3.7-8.3,8.3-8.3h23.2c2.8,0,5.4-1.1,7.4-3.1l13.6-13.6 c2-2,3.1-4.7,3.1-7.4v-27.6c0-2.8-1.1-5.4-3.1-7.4L452.4,470c-2-2-4.7-3.1-7.4-3.1h-11.8c-4.6,0-8.3-3.7-8.3-8.3v-23.2 c0-3-1.2-5.8-3.4-7.9L385,394.1c-2.1-2.1-5-3.4-8-3.4h-10c-4.6,0-8.3-3.7-8.3-8.3V359c0-3.3,1.3-6.4,3.6-8.7l27.1-27.1 c2.1-2.1,5-3.4,8-3.4h10c4.6,0,8.3,3.7,8.3,8.3v19.4c0,2.1-0.8,4-2.2,5.5l-19.3,19.3c-1.5,1.5-2.2,3.5-2.2,5.5v13.6 c0,4.6,3.7,8.3,8.3,8.3h25.4c3.3,0,6.4-1.3,8.7-3.6l30.4-30.4c2.3-2.3,3.6-5.4,3.6-8.7V250c0-3-1.2-5.8-3.4-7.9 l-29.4-29.4c-2.1-2.1-5-3.4-8-3.4h-17.9c-1.4,0-2.8-0.6-3.8-1.6l-36.5-36.5c-2.1-2.1-3.4-5-3.4-8V154 c0-4.6-3.7-8.3-8.3-8.3h-11.8c-3,0-5.8-1.2-7.9-3.4L270.8,119c-2.1-2.1-5-3.4-8-3.4h-11.8c-3,0-5.8,1.2-7.9,3.4 L228.1,134c-1.2,1.2-1.9,2.8-1.9,4.6v11.8c0,4.6,3.7,8.3,8.3,8.3h10.1c2.1,0,4-0.8,5.5-2.2l23.2-23.2c1.5-1.5,2.2-3.5,2.2-5.5 v-10c0-2.8,1.1-5.4,3.1-7.4l17.4-17.4c2-2,3.1-4.7,3.1-7.4V82.3c0-4.6-3.7-8.3-8.3-8.3H301c-3.3,0-6.4,1.3-8.7,3.6 L261.9,108c-2.3,2.3-5.4,3.6-8.7,3.6h-27.6c-4.6,0-8.3-3.7-8.3-8.3V82.3c0-3-1.2-5.8-3.4-7.9L191,51.2c-2.1-2.1-5-3.4-8-3.4 h-19.3c-4.6,0-8.3-3.7-8.3-8.3V14.5c0-3.3,1.3-6.4,3.6-8.7L162.7,2.2C165,0,168.3-0.8,171.3,0.2l1.1,0.4 c0.1,0,0.1,0.1,0.2,0.1L228.1,2.5z" />
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
