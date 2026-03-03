'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Operator, CharterRFQ, EmptyLeg } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { ShieldCheck, Plane, Users, Globe, Activity, MapPin, Zap } from 'lucide-react';
import { indiaPath, hubCoordinates } from '@/lib/geo-utils';

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const [hoveredHub, setHoveredHub] = useState<string | null>(null);

    // Data Queries
    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'operators'), where('status', '==', 'Approved'));
    }, [firestore]);
    
    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'charterRFQs');
    }, [firestore]);

    const elQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Published', 'Approved', 'live']));
    }, [firestore]);

    const { data: operators, isLoading: opsLoading } = useCollection<Operator>(operatorsQuery, 'operators');
    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');
    const { data: emptyLegs } = useCollection<EmptyLeg>(elQuery, 'emptyLegs');

    // Derived Metrics
    const activeMissionsList = useMemo(() => {
        return rfqs?.filter(r => ['operationalPreparation', 'boarding', 'departed', 'arrived'].includes(r.status)) || [];
    }, [rfqs]);

    const metrics = useMemo(() => {
        const approved = operators || [];
        return {
            activeOperators: approved.length,
            totalFleet: 124, 
            emptyLegs: emptyLegs?.length || 0,
            activeMissions: activeMissionsList.length
        };
    }, [operators, emptyLegs, activeMissionsList]);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA] overflow-hidden flex flex-col">
            {/* High-Fidelity Background with Frosted Layer */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Aviation Background"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                    
                    {/* Compact Sidebar: High-Density Analytics */}
                    <div className="w-full lg:w-56 p-4 z-20 flex flex-col gap-4 bg-black/40 backdrop-blur-3xl border-r border-white/10 overflow-y-auto text-[11px]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight font-headline">Intelligence</h1>
                            <p className="text-accent font-black text-[8px] uppercase tracking-[0.25em]">Geographic Grid Status</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <Users className="h-3 w-3 text-emerald-500 mb-1" />
                                <p className="text-base font-black text-white">{opsLoading ? '...' : metrics.activeOperators}</p>
                                <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Operators</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group hover:border-accent/30 transition-all">
                                <Plane className="h-3 w-3 text-accent mb-1" />
                                <p className="text-base font-black text-white">{metrics.totalFleet}</p>
                                <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Aircraft</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group hover:border-primary/30 transition-all">
                                <Globe className="h-3 w-3 text-primary mb-1" />
                                <p className="text-base font-black text-white">Hubs</p>
                                <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Nodes</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 group hover:border-emerald-400/30 transition-all">
                                <Zap className="h-3 w-3 text-emerald-400 mb-1" />
                                <p className="text-base font-black text-white">{metrics.emptyLegs}</p>
                                <p className="text-[7px] font-bold text-muted-foreground uppercase tracking-widest">Opportunities</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                                <p className="text-[7px] font-black uppercase text-accent tracking-[0.2em] mb-1">Health Signal</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10B981]" />
                                    <span className="text-[8px] text-muted-foreground uppercase font-bold">Network Operational</span>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-primary" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Live Missions</span>
                                </div>
                                <p className="text-lg font-black text-white">{metrics.activeMissions}</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest justify-center">
                                <ShieldCheck className="h-3 w-3 text-accent" />
                                Protocol Secure
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Spatial India Map View */}
                    <div className="relative flex-1 bg-black/20 overflow-hidden flex items-center justify-center p-4">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
                        
                        {/* Top Indicator Strip */}
                        <div className="absolute top-4 right-4 z-30">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Registry Nodes Active</span>
                                </div>
                                <div className="w-px h-3 bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Encrypted Feed</span>
                                </div>
                            </div>
                        </div>

                        {/* Spatial Map Viewport */}
                        <div className="relative w-full h-full max-w-[850px] max-h-[850px] flex items-center justify-center">
                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible">
                                <defs>
                                    <pattern id="dotPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 189, 0.25)" />
                                    </pattern>
                                    <clipPath id="indiaClip">
                                        <path d={indiaPath} />
                                    </clipPath>
                                    <radialGradient id="spatialGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="rgba(255,255,189,0.08)" />
                                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                    </radialGradient>
                                </defs>

                                <path d={indiaPath} fill="url(#spatialGlow)" className="opacity-40" />
                                <rect width="1000" height="1000" fill="url(#dotPattern)" clipPath="url(#indiaClip)" className="opacity-80" />
                                <path d={indiaPath} fill="none" stroke="rgba(255,255,189,0.1)" strokeWidth="1" />

                                <TooltipProvider>
                                    {Object.entries(hubCoordinates).map(([city, coords]) => {
                                        const hubOps = operators?.filter(o => o.city === city) || [];
                                        if (hubOps.length === 0) return null;

                                        return (
                                            <Tooltip key={city}>
                                                <TooltipTrigger asChild>
                                                    <g 
                                                        className="cursor-pointer group/marker"
                                                        onMouseEnter={() => setHoveredHub(city)}
                                                        onMouseLeave={() => setHoveredHub(null)}
                                                    >
                                                        <circle cx={coords.x} cy={coords.y} r="3.5" fill="#1DBF73" className="filter drop-shadow-[0_0_10px_#1DBF73]" />
                                                        <text x={coords.x + 10} y={coords.y + 3} fill="white" className="text-[9px] font-black pointer-events-none opacity-30 group-hover/marker:opacity-100 transition-opacity uppercase tracking-tighter">
                                                            {city}
                                                        </text>
                                                    </g>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-[#0D1B2A] border-white/10 text-white p-4 shadow-2xl backdrop-blur-2xl">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-6">
                                                            <h4 className="font-black uppercase tracking-widest text-[10px] text-accent">{city} HUB</h4>
                                                            <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-500 font-code">{coords.airport}</Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {hubOps.map(op => (
                                                                <div key={op.id} className="flex items-center justify-between gap-8 text-[10px]">
                                                                    <span className="font-bold text-white/90">{op.companyName}</span>
                                                                    <span className="text-emerald-500 font-black text-[8px] uppercase">Online</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </TooltipProvider>

                                {activeMissionsList.map(mission => {
                                    const depCity = mission.departure.split(' (')[0];
                                    const arrCity = mission.arrival.split(' (')[0];
                                    const from = hubCoordinates[depCity];
                                    const to = hubCoordinates[arrCity];
                                    
                                    if (!from || !to) return null;

                                    const cx = (from.x + to.x) / 2 + (from.y - to.y) * 0.15;
                                    const cy = (from.y + to.y) / 2 + (to.x - from.x) * 0.15;
                                    
                                    return (
                                        <path 
                                            key={mission.id}
                                            d={`M${from.x} ${from.y} Q ${cx} ${cy}, ${to.x} ${to.y}`} 
                                            fill="none" 
                                            stroke="rgba(255, 255, 189, 0.12)" 
                                            strokeWidth="1.5" 
                                            strokeDasharray="4,4"
                                            className="animate-pulse"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
