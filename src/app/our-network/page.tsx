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

/**
 * Institutional Geographic Registry
 * Using actual Latitude and Longitude for Indian Hubs
 */
const hubGeographics: Record<string, { lat: number; lng: number; airport: string }> = {
    'Delhi': { lat: 28.6139, lng: 77.2090, airport: 'VIDP' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, airport: 'VABB' },
    'Bengaluru': { lat: 12.9716, lng: 77.5946, airport: 'VOBL' },
    'Kolkata': { lat: 22.5726, lng: 88.3639, airport: 'VECC' },
    'Chennai': { lat: 13.0827, lng: 80.2707, airport: 'VOMM' },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, airport: 'VOHS' },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, airport: 'VAAH' },
    'Pune': { lat: 18.5204, lng: 73.8567, airport: 'VAPO' },
    'Jaipur': { lat: 26.9124, lng: 75.7873, airport: 'VIJP' },
    'Lucknow': { lat: 26.8467, lng: 80.9462, airport: 'VILK' },
    'Chandigarh': { lat: 30.7333, lng: 76.7794, airport: 'VICG' },
    'Goa': { lat: 15.2993, lng: 74.1240, airport: 'VOGO' },
    'Cochin': { lat: 9.9312, lng: 76.2673, airport: 'VOCI' },
    'Bhubaneswar': { lat: 20.3045, lng: 85.8178, airport: 'VEBS' },
    'Bhopal': { lat: 23.2599, lng: 77.4126, airport: 'VABP' },
    'Nagpur': { lat: 21.1458, lng: 79.0882, airport: 'VANP' },
    'Guwahati': { lat: 26.1445, lng: 91.7362, airport: 'VEGT' },
};

/**
 * Geographic Projection Engine
 * Maps Lat/Lng to a 1000x1000 SVG Viewport
 */
const project = (lat: number, lng: number) => {
    // India Bounding Box for projection
    const minLng = 68.0;
    const maxLng = 98.0;
    const minLat = 6.0;
    const maxLat = 38.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 1000;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 1000;

    return { x, y };
};

// Recalculated coordinates based on real-world data
const hubCoordinates = Object.entries(hubGeographics).reduce((acc, [city, data]) => {
    acc[city] = { ...project(data.lat, data.lng), airport: data.airport };
    return acc;
}, {} as Record<string, { x: number; y: number; airport: string }>);

// Accurate India Geographic Path for 1000x1000 SVG
const indiaPath = "M310,105 L330,85 L350,75 L370,65 L390,60 L410,65 L420,80 L425,100 L435,120 L445,140 L450,160 L460,180 L475,200 L490,215 L510,225 L535,230 L560,235 L590,245 L620,260 L650,275 L685,295 L720,315 L755,330 L790,340 L830,355 L870,375 L910,395 L940,420 L955,450 L950,485 L930,515 L900,535 L860,545 L820,555 L780,570 L745,595 L715,625 L695,665 L680,710 L660,760 L635,815 L600,875 L560,935 L515,985 L475,995 L435,985 L395,935 L355,875 L320,815 L290,760 L265,710 L245,665 L225,625 L200,595 L170,570 L135,555 L95,545 L60,535 L35,515 L15,485 L10,450 L25,420 L55,395 L95,375 L135,355 L175,340 L210,330 L245,315 L280,295 L315,275 L345,260 L375,245 L405,235 L430,230 L455,225 L475,215 L490,200 L505,180 L515,160 L520,140 L530,120 L540,100 L545,80 L555,65 L575,60 L595,65 L615,75 L635,85 L655,105 Z";

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
                    <div className="w-full lg:w-56 p-4 z-20 flex flex-col gap-4 bg-black/40 backdrop-blur-3xl border-r border-white/10 overflow-y-auto">
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
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Registry Nodes Active</span>
                                </div>
                                <div className="w-px h-3 bg-white/20" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-accent" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">Encrypted Feed</span>
                                </div>
                            </div>
                        </div>

                        {/* Spatial Map Viewport */}
                        <div className="relative w-full h-full max-w-[850px] max-h-[850px] flex items-center justify-center">
                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible">
                                <defs>
                                    {/* Spatial Dot Matrix Pattern */}
                                    <pattern id="dotPattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 189, 0.25)" />
                                    </pattern>
                                    
                                    {/* Geographic Clip Mask */}
                                    <clipPath id="indiaClip">
                                        <path d={indiaPath} />
                                    </clipPath>

                                    <radialGradient id="spatialGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="rgba(255,255,189,0.08)" />
                                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                    </radialGradient>
                                </defs>

                                {/* India Silhouette Glow */}
                                <path 
                                    d={indiaPath} 
                                    fill="url(#spatialGlow)"
                                    className="opacity-40"
                                />

                                {/* Spatial Map Layer */}
                                <rect 
                                    width="1000" 
                                    height="1000" 
                                    fill="url(#dotPattern)" 
                                    clipPath="url(#indiaClip)" 
                                    className="opacity-80"
                                />

                                {/* Geographic Boundary Line */}
                                <path 
                                    d={indiaPath} 
                                    fill="none" 
                                    stroke="rgba(255,255,189,0.1)" 
                                    strokeWidth="1" 
                                />

                                {/* Hub Markers */}
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
                                                        {/* Static Marker Circle */}
                                                        <circle 
                                                            cx={coords.x} 
                                                            cy={coords.y} 
                                                            r="3.5" 
                                                            fill="#1DBF73" 
                                                            className="filter drop-shadow-[0_0_10px_#1DBF73]" 
                                                        />
                                                        <text 
                                                            x={coords.x + 10} 
                                                            y={coords.y + 3} 
                                                            fill="white" 
                                                            className="text-[9px] font-black pointer-events-none opacity-30 group-hover/marker:opacity-100 transition-opacity uppercase tracking-tighter"
                                                        >
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

                                {/* Dynamic Mission Arcs */}
                                {activeMissionsList.map(mission => {
                                    const depCity = mission.departure.split(' (')[0];
                                    const arrCity = mission.arrival.split(' (')[0];
                                    const from = hubCoordinates[depCity];
                                    const to = hubCoordinates[arrCity];
                                    
                                    if (!from || !to) return null;

                                    // Institutional routing curves
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
