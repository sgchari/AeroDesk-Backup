'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Operator, CharterRFQ } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Plane, Building2, Landmark, Zap } from 'lucide-react';
import { indiaPath, hubCoordinates } from '@/lib/geo-utils';

const HUB_DETAILS = {
    'Delhi': { label: 'Delhi - NCR Hub', position: 'top-right', operators: ['Delhi Air', 'Club One'], partners: ['Taj', 'ITC'] },
    'Mumbai': { label: 'Mumbai Hub', position: 'mid-left', operators: ['FlyCo', 'Taj Air'], partners: ['Oberoi', 'Marriott'] },
    'Bengaluru': { label: 'South Zone Hub', position: 'bottom-left', operators: ['Deccan'], partners: ['Leela', 'Ritz'] },
    'Kolkata': { label: 'East Zone Hub', position: 'mid-right', operators: ['East Wings'], partners: ['ITC Sonar'] },
    'Hyderabad': { label: 'Hyderabad Hub', position: 'mid-center-right', operators: ['GMR Air'], partners: ['Novotel'] },
    'Chennai': { label: 'Chennai Hub', position: 'bottom-right', operators: ['Blue Dart'], partners: ['Westin'] },
};

const HubCallout = ({ city, data, active }: { city: string; data: any; active: boolean }) => {
    const posClasses = {
        'top-right': 'top-[15%] right-[22%]',
        'mid-left': 'top-[45%] left-[15%]',
        'mid-right': 'top-[40%] right-[8%]',
        'mid-center-right': 'top-[55%] right-[20%]',
        'bottom-left': 'bottom-[15%] left-[22%]',
        'bottom-right': 'bottom-[12%] right-[25%]',
    }[data.position as string];

    return (
        <div className={cn(
            "absolute z-30 transition-all duration-500",
            posClasses,
            active ? "opacity-100 translate-y-0 scale-100" : "opacity-60 translate-y-2 scale-95"
        )}>
            <div className="relative group">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-4 md:p-6 w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-accent/40 transition-colors">
                    <div className="absolute -top-2 bg-accent text-black text-[7px] md:text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        NODE: {city.toUpperCase()}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-1">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                            <Plane className="h-3 w-3 md:h-3.5 md:w-3.5 text-accent" />
                        </div>
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                            <Building2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-primary" />
                        </div>
                    </div>
                    
                    <p className="text-[8px] md:text-[9px] font-black text-white uppercase tracking-tighter mt-1">{data.label}</p>
                    <div className="flex gap-1 mt-2">
                        {data.operators.map((op: string) => (
                            <div key={op} className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const [hoveredHub, setHoveredHub] = useState<string | null>(null);

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'charterRequests');
    }, [firestore]);

    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const activeMissionsList = useMemo(() => {
        return rfqs?.filter(r => 
            ['departed', 'live', 'enroute', 'arrived'].includes(r.status)
        ) || [];
    }, [rfqs]);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA] overflow-hidden flex flex-col bg-[#0B1220]">
            {/* Precision Visual Atmosphere */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-10 blur-xl"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-[#0B1220]/80" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col p-4 md:p-8">
                    
                    <div className="absolute top-8 left-8 z-20 space-y-1">
                        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter font-headline text-white/90 uppercase">National Infrastructure Grid</h1>
                        <p className="text-accent font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] opacity-60">Aviation Network Registry v1.0.6</p>
                    </div>

                    <div className="absolute bottom-8 right-8 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl hidden lg:block shadow-2xl">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-accent" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Backbone Hub</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">NSOP Operator Base</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="h-3.5 w-3.5 text-accent animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Live Mission Arc</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center">
                        <div className="relative w-full h-full max-w-[850px] max-h-[850px] flex items-center justify-center">
                            {/* Proximity Callouts */}
                            {Object.entries(HUB_DETAILS).map(([city, data]) => (
                                <HubCallout key={city} city={city} data={data} active={hoveredHub === city} />
                            ))}

                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible drop-shadow-[0_0_50px_rgba(14,165,233,0.1)] animate-in fade-in zoom-in duration-1000">
                                <defs>
                                    <pattern id="dotPatternActual" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 189, 0.1)" />
                                    </pattern>
                                    <clipPath id="indiaClipActual">
                                        <path d={indiaPath} />
                                    </clipPath>
                                    <filter id="glowActual">
                                        <feGaussianBlur stdDeviation="4" result="blur"/>
                                        <feMerge>
                                            <feMergeNode in="blur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>

                                <path d={indiaPath} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                                <rect width="1000" height="1000" fill="url(#dotPatternActual)" clipPath="url(#indiaClipActual)" />

                                {Object.entries(hubCoordinates).map(([city, coords]) => {
                                    const hasCallout = !!HUB_DETAILS[city as keyof typeof HUB_DETAILS];
                                    const isActive = hoveredHub === city;
                                    
                                    return (
                                        <g key={city} 
                                           className="cursor-pointer transition-all duration-300" 
                                           onMouseEnter={() => setHoveredHub(city)} 
                                           onMouseLeave={() => setHoveredHub(null)}>
                                            
                                            {hasCallout ? (
                                                <g filter={isActive ? "url(#glowActual)" : "none"}>
                                                    <path 
                                                        d={`M${coords.x},${coords.y-8} L${coords.x+6},${coords.y+4} L${coords.x-6},${coords.y+4} Z`} 
                                                        fill={isActive ? "#FFFFBD" : "rgba(255,255,189,0.6)"} 
                                                        className={cn("transition-all duration-300", isActive ? "scale-150" : "scale-100")}
                                                    />
                                                    <circle cx={coords.x} cy={coords.y} r="12" fill="transparent" stroke={isActive ? "rgba(255,255,189,0.3)" : "transparent"} strokeWidth="1" className="animate-ping" />
                                                </g>
                                            ) : (
                                                <circle cx={coords.x} cy={coords.y} r="2.5" fill="#1DBF73" className="opacity-40" />
                                            )}

                                            <text x={coords.x + 10} y={coords.y + 3} fill="white" className={cn("text-[8px] font-black uppercase tracking-tighter pointer-events-none transition-opacity", isActive ? "opacity-100" : "opacity-30")}>
                                                {city}
                                            </text>
                                        </g>
                                    );
                                })}

                                {activeMissionsList.map(mission => {
                                    const depCity = mission.departure.split(' (')[0];
                                    const arrCity = mission.arrival.split(' (')[0];
                                    const from = hubCoordinates[depCity];
                                    const to = hubCoordinates[arrCity];
                                    if (!from || !to) return null;
                                    
                                    const cx = (from.x + to.x) / 2 + (from.y - to.y) * 0.15;
                                    const cy = (from.y + to.y) / 2 + (to.x - from.x) * 0.15;
                                    
                                    return (
                                        <g key={mission.id}>
                                            <path d={`M${from.x} ${from.y} Q ${cx} ${cy}, ${to.x} ${to.y}`} 
                                                  fill="none" stroke="#FFFFBD" strokeWidth="1.5" strokeDasharray="5,5" className="opacity-50 animate-pulse" />
                                            <circle cx={from.x} cy={from.y} r="2" fill="white" />
                                            <circle cx={to.x} cy={to.y} r="2" fill="white" />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </main>
            </div>
            <LandingFooter />
        </div>
    );
}
