
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

    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'operators');
    }, [firestore]);
    
    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'charterRequests');
    }, [firestore]);

    const elQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'emptyLegs');
    }, [firestore]);

    const { data: operators, isLoading: opsLoading } = useCollection<Operator>(operatorsQuery, 'operators');
    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');
    const { data: emptyLegs } = useCollection<EmptyLeg>(elQuery, 'emptyLegs');

    const activeMissionsList = useMemo(() => {
        return rfqs?.filter(r => 
            ['operationalPreparation', 'boarding', 'departed', 'arrived', 'enroute', 'live'].includes(r.status)
        ) || [];
    }, [rfqs]);

    const metrics = useMemo(() => {
        return {
            activeOperators: operators?.filter(o => o.status === 'Approved').length || 0,
            totalFleet: 124, 
            emptyLegs: emptyLegs?.filter(e => ['Published', 'Approved', 'live', 'live'].includes(e.status)).length || 0,
            activeMissions: activeMissionsList.length
        };
    }, [operators, emptyLegs, activeMissionsList]);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA] overflow-x-hidden flex flex-col">
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex flex-col lg:flex-row flex-1 min-h-0">
                    
                    {/* Metrics Sidebar */}
                    <div className="w-full lg:w-64 p-4 md:p-6 z-20 flex flex-col gap-4 md:gap-6 bg-black/40 backdrop-blur-3xl border-b lg:border-b-0 lg:border-r border-white/10 text-[11px]">
                        <div className="space-y-1">
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight font-headline">Intelligence</h1>
                            <p className="text-accent font-black text-[8px] uppercase tracking-[0.25em]">Geographic Grid Status</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <Users className="h-4 w-4 text-emerald-500 mb-2" />
                                <p className="text-lg md:text-xl font-black text-white">{opsLoading ? '...' : metrics.activeOperators}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Active Operators</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-accent/30 transition-all">
                                <Plane className="h-4 w-4 text-accent mb-2" />
                                <p className="text-lg md:text-xl font-black text-white">{metrics.totalFleet}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Registered Fleet</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-primary/30 transition-all">
                                <Globe className="h-4 w-4 text-primary mb-2" />
                                <p className="text-lg md:text-xl font-black text-white">Registry</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Network Nodes</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-400/30 transition-all">
                                <Zap className="h-4 w-4 text-emerald-400 mb-2" />
                                <p className="text-lg md:text-xl font-black text-white">{metrics.emptyLegs}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">EL Opportunities</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col gap-3 mt-auto">
                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                                <p className="text-[8px] font-black uppercase text-accent tracking-[0.2em] mb-2">Health Signal</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Network Operational</span>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Live Missions</span>
                                </div>
                                <p className="text-2xl font-black text-white">{metrics.activeMissions}</p>
                            </div>

                            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest justify-center pt-4 border-t border-white/5">
                                <ShieldCheck className="h-4 w-4 text-accent" />
                                Protocol Secure
                            </div>
                        </div>
                    </div>

                    {/* Spatial Map Viewport */}
                    <div className="relative flex-1 bg-black/20 overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[600px] p-4">
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        
                        <div className="absolute top-4 right-4 z-30 hidden sm:flex">
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

                        <div className="relative w-full h-full max-w-[900px] max-h-[900px] flex items-center justify-center">
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
                                        const hubOps = operators?.filter(o => o.city === city && o.status === 'Approved') || [];
                                        const isVisibleHub = hubOps.length > 0 || ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Bhopal'].includes(city);

                                        if (!isVisibleHub) return null;

                                        return (
                                            <Tooltip key={city}>
                                                <TooltipTrigger asChild>
                                                    <g className="cursor-pointer group/marker" onMouseEnter={() => setHoveredHub(city)} onMouseLeave={() => setHoveredHub(null)}>
                                                        <circle cx={coords.x} cy={coords.y} r={hubOps.length > 0 ? "5" : "3"} fill="#1DBF73" className={cn("filter transition-all", hubOps.length > 0 ? "drop-shadow-[0_0_10px_#1DBF73]" : "opacity-40")} />
                                                        <text x={coords.x + 12} y={coords.y + 4} fill="white" className="text-[10px] font-black pointer-events-none opacity-40 group-hover/marker:opacity-100 transition-opacity uppercase tracking-tighter hidden sm:block">
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
                                                            {hubOps.length > 0 ? hubOps.map(op => (
                                                                <div key={op.id} className="flex items-center justify-between gap-8 text-[10px]">
                                                                    <span className="font-bold text-white/90">{op.companyName}</span>
                                                                    <span className="text-emerald-500 font-black text-[8px] uppercase">Online</span>
                                                                </div>
                                                            )) : (
                                                                <p className="text-[9px] text-white/40 italic">Registry Node Standby</p>
                                                            )}
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
                                        <g key={mission.id} className="animate-in fade-in duration-1000">
                                            <path d={`M${from.x} ${from.y} Q ${cx} ${cy}, ${to.x} ${to.y}`} fill="none" stroke="rgba(255, 255, 189, 0.2)" strokeWidth="1.5" strokeDasharray="4,4" className="animate-pulse" />
                                            <circle cx={from.x} cy={from.y} r={2} fill="white" />
                                            <circle cx={to.x} cy={to.y} r={2} fill="white" />
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </main>
                <div className="lg:hidden bg-black/60 p-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase text-white">{metrics.activeMissions} Live Missions</span>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        <span className="text-[10px] font-black uppercase text-white">Nodes Active</span>
                    </div>
                </div>
            </div>
            <LandingFooter />
        </div>
    );
}
