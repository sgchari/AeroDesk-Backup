'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { CharterRFQ } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Plane, Building2, Zap, ShieldCheck } from 'lucide-react';
import { indiaPath, hubGeographics, project } from '@/lib/geo-utils';

const NetworkNodeCard = ({ city, data, x, y }: { city: string; data: any; x: number; y: number }) => {
    // Quadrant-aware positioning: Determine which quadrant the node is in relative to center (500, 500)
    // x and y are in the 0-1000 range
    const isRightHalf = x > 500;
    const isBottomHalf = y > 500;

    return (
        <div 
            className="absolute z-30 transition-all duration-500 group pointer-events-none"
            style={{ left: `${x / 10}%`, top: `${y / 10}%` }}
        >
            <div className="relative flex items-center justify-center pointer-events-auto cursor-pointer">
                {data.type === 'backbone' ? (
                    <div className="relative">
                        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-accent drop-shadow-[0_0_12px_rgba(255,255,189,0.6)]" />
                        <div className="absolute inset-0 w-full h-full border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-accent animate-ping opacity-20" />
                    </div>
                ) : (
                    <div className="relative">
                        <div className="w-4 h-4 bg-emerald-500 rounded-sm drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                        <div className="absolute inset-0 w-full h-full bg-emerald-500 rounded-sm animate-ping opacity-20" />
                    </div>
                )}

                {/* Intelligent Positioning Tooltip: Quadrant Aware */}
                <div className={cn(
                    "absolute opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 w-56 bg-[#0B1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-none z-50",
                    isRightHalf ? "right-6 sm:right-8" : "left-6 sm:left-8",
                    isBottomHalf ? "bottom-6 sm:bottom-8" : "top-6 sm:top-8"
                )}>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{city} Sector</span>
                            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-white/60 uppercase">
                                {data.type} Node
                            </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">{data.label}</p>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                                <p className="text-[8px] uppercase font-black text-muted-foreground">Operators</p>
                                <div className="flex items-center gap-1.5">
                                    <Plane className="h-3 w-3 text-accent" />
                                    <span className="text-[11px] font-bold">{data.operators} NSOP</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] uppercase font-black text-muted-foreground">Partners</p>
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="h-3 w-3 text-primary" />
                                    <span className="text-[11px] font-bold">{data.partners} Stays</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <p className="text-[9px] text-muted-foreground italic flex items-center gap-2">
                                <ShieldCheck className="h-2.5 w-2.5 text-accent/60" />
                                Fully synchronized registry
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OurNetworkPage() {
    const firestore = useFirestore();

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'charterRequests');
    }, [firestore]);

    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const liveMissionsList = useMemo(() => {
        return rfqs?.filter(r => ['departed', 'live', 'enroute', 'arrived'].includes(r.status)) || [];
    }, [rfqs]);

    const projectedHubs = useMemo(() => {
        return Object.entries(hubGeographics).map(([city, data]) => {
            const { x, y } = project(data.lat, data.lng);
            return { city, data, x, y };
        });
    }, []);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA] overflow-hidden flex flex-col bg-[#0B1220]">
            {/* Visual Atmosphere Layer */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-10 blur-3xl"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-aviation-radial opacity-95" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent h-screen max-h-screen">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
                    
                    {/* Left: Institutional Content (35%) */}
                    <div className="w-full lg:w-[35%] p-6 md:p-12 flex flex-col justify-center gap-8 z-20">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Telemetry</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline text-white uppercase leading-none">
                                National <br />
                                <span className="text-accent">Coordination Grid</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
                                Visualizing India's private aviation backbone through real-time operational awareness and hub synchronization.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Active Hubs</p>
                                <p className="text-2xl font-black text-white">{Object.keys(hubGeographics).length}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Ready Units</p>
                                <p className="text-2xl font-black text-white">42</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Live Missions</p>
                                <p className="text-2xl font-black text-emerald-500">{liveMissionsList.length}</p>
                            </div>
                        </div>

                        {/* Legend for context */}
                        <div className="p-6 bg-black/20 backdrop-blur-xl border border-white/5 rounded-3xl space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Protocol Index</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-accent" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Backbone Hub</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">NSOP Operator Base</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Geographic Grid (65%) */}
                    <div className="flex-1 relative h-full w-full flex items-center justify-center p-4 lg:p-0 overflow-hidden">
                        <div className="relative w-full h-[70vh] lg:h-[80vh] flex items-center justify-center max-w-[1000px] transition-transform duration-1000">
                            
                            {/* SVG Map Core */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Absolute positioned data nodes */}
                                {projectedHubs.map((hub) => (
                                    <NetworkNodeCard key={hub.city} city={hub.city} data={hub.data} x={hub.x} y={hub.y} />
                                ))}

                                <svg 
                                    viewBox="0 0 1000 1000" 
                                    preserveAspectRatio="xMidYMid meet"
                                    className="w-full h-full overflow-visible drop-shadow-[0_0_100px_rgba(14,165,233,0.1)]"
                                    width="100%"
                                    height="100%"
                                >
                                    <defs>
                                        <pattern id="dotPatternGrid" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                                            <circle cx="2" cy="2" r="0.8" fill="rgba(14, 165, 233, 0.15)" />
                                        </pattern>
                                        <clipPath id="indiaClipPrecision">
                                            <path d={indiaPath} />
                                        </clipPath>
                                        <linearGradient id="missionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="transparent" />
                                            <stop offset="50%" stopColor="#FFFFBD" stopOpacity="0.9" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                        <filter id="neonGlow">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    {/* Base Landmass silhouette */}
                                    <path 
                                        d={indiaPath} 
                                        fill="rgba(14, 165, 233, 0.03)" 
                                        stroke="rgba(14, 165, 233, 0.25)" 
                                        strokeWidth="4" 
                                        filter="url(#neonGlow)"
                                        className="transition-all duration-1000"
                                    />
                                    
                                    {/* Coordinate Grid Overlay */}
                                    <rect width="1000" height="1000" fill="url(#dotPatternGrid)" clipPath="url(#indiaClipPrecision)" />

                                    {/* Strategic Backbone Connectors (Low Opacity) */}
                                    <g className="opacity-10">
                                        {projectedHubs.filter(h => h.data.type === 'backbone').map((h1, i, arr) => (
                                            arr.slice(i + 1).map((h2) => (
                                                <line 
                                                    key={`${h1.city}-${h2.city}`} 
                                                    x1={h1.x} y1={h1.y} x2={h2.x} y2={h2.y} 
                                                    stroke="hsl(var(--primary))" 
                                                    strokeWidth="1.5" 
                                                    strokeDasharray="6,6" 
                                                />
                                            ))
                                        ))}
                                    </g>

                                    {/* Live Mission Arc Telemetry */}
                                    {liveMissionsList.map(mission => {
                                        const depCity = mission.departure.split(' (')[0];
                                        const arrCity = mission.arrival.split(' (')[0];
                                        
                                        const fromCoords = hubGeographics[depCity];
                                        const toCoords = hubGeographics[arrCity];
                                        
                                        if (!fromCoords || !toCoords) return null;
                                        
                                        const from = project(fromCoords.lat, fromCoords.lng);
                                        const to = project(toCoords.lat, toCoords.lng);
                                        
                                        const dx = to.x - from.x;
                                        const dy = to.y - from.y;
                                        const dr = Math.sqrt(dx * dx + dy * dy);
                                        
                                        return (
                                            <g key={mission.id} className="animate-in fade-in duration-1000">
                                                <path 
                                                    d={`M${from.x},${from.y} A${dr},${dr} 0 0,1 ${to.x},${to.y}`} 
                                                    fill="none" 
                                                    stroke="url(#missionGrad)" 
                                                    strokeWidth="3" 
                                                    strokeDasharray="15,15"
                                                    className="animate-pulse"
                                                >
                                                    <animate attributeName="stroke-dashoffset" from="300" to="0" dur="10s" repeatCount="indefinite" />
                                                </path>
                                                <circle cx={from.x} cy={from.y} r="2" fill="white" />
                                                <circle cx={to.x} cy={to.y} r="2" fill="white" />
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            <div className="relative z-20">
                <LandingFooter />
            </div>
        </div>
    );
}
