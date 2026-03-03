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
    'Hyderabad': { label: 'Hyderabad Hub', position: 'bottom-right', operators: ['GMR Air'], partners: ['Novotel'] },
    'Chennai': { label: 'Chennai Hub', position: 'bottom-center', operators: ['Blue Dart'], partners: ['Westin'] },
};

const HubCallout = ({ city, data, active }: { city: string; data: any; active: boolean }) => {
    const posClasses = {
        'top-right': 'top-4 right-4 md:top-10 md:right-10',
        'mid-left': 'top-[25%] left-4 md:left-10',
        'mid-right': 'top-[35%] right-4 md:right-10',
        'bottom-left': 'bottom-[15%] left-4 md:left-10',
        'bottom-right': 'bottom-[15%] right-4 md:right-10',
        'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
    }[data.position as string];

    return (
        <div className={cn(
            "absolute z-30 transition-all duration-500",
            posClasses,
            active ? "opacity-100 translate-y-0 scale-100" : "opacity-60 translate-y-2 scale-95"
        )}>
            <div className="relative group">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-4 md:p-6 w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-accent/40 transition-colors">
                    <div className="absolute -top-2 bg-accent text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        NETWORK NODE
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-1">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                            <Plane className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                            <Building2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                        </div>
                    </div>
                    
                    <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-tighter mt-1">{data.label}</p>
                    <div className="flex gap-1 mt-2">
                        {data.operators.slice(0, 2).map((op: string) => (
                            <div key={op} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ))}
                    </div>
                </div>

                <div className="absolute -right-12 top-0 space-y-1 hidden md:block">
                    {data.partners.map((p: string) => (
                        <div key={p} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span className="text-[8px] font-bold text-white/60 uppercase">{p}</span>
                        </div>
                    ))}
                </div>
                <div className="absolute -left-12 bottom-0 space-y-1 hidden md:block text-right">
                    {data.operators.map((o: string) => (
                        <div key={o} className="flex items-center gap-2 justify-end">
                            <span className="text-[8px] font-bold text-sky-400 uppercase">{o}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        </div>
                    ))}
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
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-20"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-transparent to-[#0B1220]" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col p-4 md:p-8">
                    
                    <div className="absolute top-8 left-8 z-20 space-y-1">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline text-white/90 uppercase">National Infrastructure Grid</h1>
                        <p className="text-accent font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Aviation Network Registry v1.0.6</p>
                    </div>

                    <div className="absolute bottom-8 right-8 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl hidden lg:block">
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

                    {Object.entries(HUB_DETAILS).map(([city, data]) => (
                        <HubCallout key={city} city={city} data={data} active={hoveredHub === city} />
                    ))}

                    <div className="relative flex-1 flex items-center justify-center">
                        <div className="w-full h-full max-w-[900px] max-h-[900px] animate-in fade-in zoom-in duration-1000">
                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(14,165,233,0.1)]">
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

                                <path d={indiaPath} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
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
                                                        d={`M${coords.x},${coords.y-10} L${coords.x+8},${coords.y+6} L${coords.x-8},${coords.y+6} Z`} 
                                                        fill={isActive ? "#FFFFBD" : "rgba(255,255,189,0.6)"} 
                                                        className={cn("transition-all duration-300", isActive ? "scale-125" : "scale-100")}
                                                    />
                                                    <circle cx={coords.x} cy={coords.y} r="15" fill="transparent" stroke={isActive ? "rgba(255,255,189,0.2)" : "transparent"} strokeWidth="1" className="animate-ping" />
                                                </g>
                                            ) : (
                                                <circle cx={coords.x} cy={coords.y} r="3" fill="#1DBF73" className="opacity-40" />
                                            )}

                                            <text x={coords.x + 12} y={coords.y + 4} fill="white" className={cn("text-[9px] font-black uppercase tracking-tighter pointer-events-none transition-opacity", isActive ? "opacity-100" : "opacity-30")}>
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
                                                  fill="none" stroke="#FFFFBD" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-40 animate-pulse" />
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
