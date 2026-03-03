
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Operator, CharterRFQ, EmptyLeg } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { ShieldCheck, Plane, Users, Globe, MapPin, Zap, Building2, Landmark } from 'lucide-react';
import { indiaPath, hubCoordinates } from '@/lib/geo-utils';

const HUB_DETAILS = {
    'Delhi': { label: 'Delhi - NCR', position: 'top-right', operators: ['Delhi Air', 'Club One'], partners: ['Taj', 'ITC'] },
    'Mumbai': { label: 'Mumbai', position: 'mid-left', operators: ['FlyCo', 'Taj Air'], partners: ['Oberoi', 'Marriott'] },
    'Bengaluru': { label: 'Bangalore', position: 'bottom-left', operators: ['Deccan'], partners: ['Leela', 'Ritz'] },
    'Kolkata': { label: 'Kolkata', position: 'mid-right', operators: ['East Wings'], partners: ['ITC Sonar'] },
    'Hyderabad': { label: 'Hyderabad', position: 'bottom-right', operators: ['GMR Air'], partners: ['Novotel'] },
    'Chennai': { label: 'Chennai', position: 'bottom-center', operators: ['Blue Dart'], partners: ['Westin'] },
};

const HubCallout = ({ city, data, active }: { city: string; data: any; active: boolean }) => {
    const posClasses = {
        'top-right': 'top-4 right-4 md:top-10 md:right-10',
        'mid-left': 'top-1/3 left-4 md:left-10',
        'mid-right': 'top-1/2 right-4 md:right-10',
        'bottom-left': 'bottom-20 left-4 md:left-10',
        'bottom-right': 'bottom-20 right-4 md:right-10',
        'bottom-center': 'bottom-10 left-1/2 -translate-x-1/2',
    }[data.position as string];

    return (
        <div className={cn(
            "absolute z-30 transition-all duration-500 scale-90 md:scale-100",
            posClasses,
            active ? "opacity-100 translate-y-0" : "opacity-60 translate-y-2"
        )}>
            <div className="relative group">
                {/* Connecting Line (Visual only for aesthetics) */}
                <div className="hidden lg:block absolute w-px h-16 bg-gradient-to-b from-accent/40 to-transparent -bottom-16 left-1/2" />
                
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-4 md:p-6 w-32 h-32 md:w-40 md:h-40 flex flex-col items-center justify-center text-center shadow-2xl group-hover:border-accent/40 transition-colors">
                    <div className="absolute -top-2 bg-accent text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                        {city === 'Delhi' ? 'NIXI' : 'AMS-IX'}
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

                {/* Satellite Labels */}
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

    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore as any, 'operators');
    }, [firestore]);
    
    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore as any, 'charterRequests');
    }, [firestore]);

    const { data: operators, isLoading: opsLoading } = useCollection<Operator>(operatorsQuery as any, 'operators');
    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery as any, 'charterRequests');

    const activeMissionsList = useMemo(() => {
        return rfqs?.filter(r => 
            ['operationalPreparation', 'boarding', 'departed', 'arrived', 'enroute', 'live'].includes(r.status)
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
                    
                    {/* Header Overlay */}
                    <div className="absolute top-8 left-8 z-20 space-y-1">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline text-white/90">Our Network</h1>
                        <p className="text-accent font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Aviation Infrastructure Grid v1.0</p>
                    </div>

                    {/* Infrastructure Legend */}
                    <div className="absolute bottom-8 right-8 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-xl hidden lg:block">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-accent" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Backbone Hub</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                <span className="text-[9px] font-black uppercase tracking-widest">NSOP Base</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Landmark className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Location</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Private Peering</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-sky-400" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Public Peering</span>
                            </div>
                        </div>
                    </div>

                    {/* Callouts */}
                    {Object.entries(HUB_DETAILS).map(([city, data]) => (
                        <HubCallout key={city} city={city} data={data} active={hoveredHub === city} />
                    ))}

                    {/* Central Map Viewport */}
                    <div className="relative flex-1 flex items-center justify-center">
                        <div className="w-full h-full max-w-[800px] max-h-[800px]">
                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible">
                                <defs>
                                    <pattern id="dotPatternNet" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 189, 0.15)" />
                                    </pattern>
                                    <clipPath id="indiaClipNet">
                                        <path d={indiaPath} />
                                    </clipPath>
                                    <filter id="glowNet">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                        <feMerge>
                                            <feMergeNode in="coloredBlur"/>
                                            <feMergeNode in="SourceGraphic"/>
                                        </feMerge>
                                    </filter>
                                </defs>

                                <path d={indiaPath} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                                <rect width="1000" height="1000" fill="url(#dotPatternNet)" clipPath="url(#indiaClipNet)" />

                                {/* Hub Markers & Labels */}
                                {Object.entries(hubCoordinates).map(([city, coords]) => {
                                    const hasCallout = !!HUB_DETAILS[city as keyof typeof HUB_DETAILS];
                                    
                                    return (
                                        <g key={city} 
                                           className="cursor-pointer" 
                                           onMouseEnter={() => setHoveredHub(city)} 
                                           onMouseLeave={() => setHoveredHub(null)}>
                                            
                                            {/* Triangles for Backbone Hubs */}
                                            {hasCallout ? (
                                                <path 
                                                    d={`M${coords.x},${coords.y-8} L${coords.x+7},${coords.y+5} L${coords.x-7},${coords.y+5} Z`} 
                                                    fill="#FFFFBD" 
                                                    filter="url(#glowNet)"
                                                    className={cn("transition-transform duration-300", hoveredHub === city && "scale-125")}
                                                />
                                            ) : (
                                                <circle cx={coords.x} cy={coords.y} r="3" fill="#1DBF73" className="opacity-40" />
                                            )}

                                            <text x={coords.x + 12} y={coords.y + 4} fill="white" className="text-[10px] font-black uppercase tracking-tighter opacity-40 pointer-events-none hidden sm:block">
                                                {city}
                                            </text>

                                            {/* Connecting line to Callout (Conceptual) */}
                                            {hasCallout && hoveredHub === city && (
                                                <line 
                                                    x1={coords.x} y1={coords.y} 
                                                    x2={coords.x > 500 ? coords.x + 100 : coords.x - 100} 
                                                    y2={coords.y > 500 ? coords.y + 100 : coords.y - 100}
                                                    stroke="#FFFFBD" strokeWidth="1" strokeDasharray="4,2" className="animate-in fade-in"
                                                />
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Active Mission Arcs */}
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
                                                  fill="none" stroke="#FFFFBD" strokeWidth="1.5" strokeDasharray="4,4" className="opacity-30 animate-pulse" />
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
