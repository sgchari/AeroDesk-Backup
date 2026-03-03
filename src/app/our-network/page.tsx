'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { CharterRFQ } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Plane, Building2, Zap, ShieldCheck, Target, Globe } from 'lucide-react';
import { indiaPath, hubGeographics, project } from '@/lib/geo-utils';

const NetworkNodeCard = ({ city, data, x, y }: { city: string; data: any; x: number; y: number }) => {
    // Collision-aware positioning: Determine which quadrant the node is in
    const isRightHalf = x > 500;
    const isBottomHalf = y > 500;

    return (
        <div 
            className="absolute z-30 transition-all duration-500 group pointer-events-none"
            style={{ left: `${x / 10}%`, top: `${y / 10}%` }}
        >
            {/* The actual clickable marker point */}
            <div className="relative flex items-center justify-center pointer-events-auto cursor-pointer">
                {data.type === 'backbone' ? (
                    <div className="relative">
                        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-accent drop-shadow-[0_0_8px_rgba(255,255,189,0.5)]" />
                        <div className="absolute inset-0 w-full h-full border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-accent animate-ping opacity-20" />
                    </div>
                ) : (
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-sm drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <div className="absolute inset-0 w-full h-full bg-emerald-500 rounded-sm animate-ping opacity-20" />
                    </div>
                )}

                {/* Card Tooltip - Intelligent Positioning */}
                <div className={cn(
                    "absolute opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 w-48 bg-[#0B1220]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl pointer-events-none",
                    isRightHalf ? "right-6" : "left-6",
                    isBottomHalf ? "bottom-6" : "top-6"
                )}>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                            <span className="text-[8px] font-black uppercase tracking-widest text-accent">{city} Node</span>
                            <Badge variant="outline" className="h-3.5 px-1.5 border-white/10 text-[7px] font-bold text-white/40">{data.type.toUpperCase()}</Badge>
                        </div>
                        <p className="text-[10px] font-bold text-white leading-tight">{data.label}</p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="space-y-0.5">
                                <p className="text-[7px] uppercase font-black text-muted-foreground">Operators</p>
                                <div className="flex items-center gap-1">
                                    <Plane className="h-2.5 w-2.5 text-accent" />
                                    <span className="text-[9px] font-bold">{data.operators} NSOP</span>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[7px] uppercase font-black text-muted-foreground">Partners</p>
                                <div className="flex items-center gap-1">
                                    <Building2 className="h-2.5 w-2.5 text-primary" />
                                    <span className="text-[9px] font-bold">{data.partners} Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, variant, className }: any) => (
    <div className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", className)}>
        {children}
    </div>
);

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
            {/* Optimized Visual Atmosphere */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-10 blur-2xl"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-aviation-radial opacity-90" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col p-4 md:p-12">
                    
                    {/* Institutional Header */}
                    <div className="max-w-xl space-y-2 mb-8 md:mb-0">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter font-headline text-white uppercase">
                            National Infrastructure Grid
                        </h1>
                        <p className="text-accent font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em] opacity-60">
                            Digital Coordination & Logistics Registry v1.0.8
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">Network Live</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3 text-primary" />
                                <span className="text-[9px] font-black uppercase text-white/60 tracking-widest">Global Sync Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend: Anchored Bottom Right */}
                    <div className="absolute bottom-12 right-12 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl hidden lg:block shadow-2xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 border-b border-white/5 pb-2">Platform Protocol</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-accent" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Backbone Hub</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">NSOP Base Station</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-0.5 bg-primary/40 rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Logistics Readiness</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Zap className="h-3.5 w-3.5 text-accent fill-accent animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-accent">Live Telemetry Arc</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Spatial Engine */}
                    <div className="relative flex-1 flex items-center justify-center py-12 md:py-0">
                        <div className="relative w-full aspect-square max-w-[850px] flex items-center justify-center">
                            
                            {/* Collision-Aware Data Nodes */}
                            {projectedHubs.map((hub) => (
                                <NetworkNodeCard key={hub.city} city={hub.city} data={hub.data} x={hub.x} y={hub.y} />
                            ))}

                            <svg 
                                viewBox="0 0 1000 1000" 
                                preserveAspectRatio="xMidYMid meet"
                                className="w-full h-full overflow-visible drop-shadow-[0_0_80px_rgba(14,165,233,0.08)]"
                            >
                                <defs>
                                    <pattern id="dotPatternInfra" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="0.8" fill="rgba(255, 255, 189, 0.12)" />
                                    </pattern>
                                    <clipPath id="indiaClipPrecision">
                                        <path d={indiaPath} />
                                    </clipPath>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="50%" stopColor="#FFFFBD" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>

                                {/* Base Landmass Silhouette */}
                                <path 
                                    d={indiaPath} 
                                    fill="rgba(255,255,255,0.02)" 
                                    stroke="rgba(14,165,233,0.15)" 
                                    strokeWidth="3" 
                                    className="filter drop-shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                                />
                                
                                {/* Coordinate Matrix Layer */}
                                <rect width="1000" height="1000" fill="url(#dotPatternInfra)" clipPath="url(#indiaClipPrecision)" />

                                {/* Strategic Backbone Corridors */}
                                <g className="opacity-20">
                                    {projectedHubs.filter(h => h.data.type === 'backbone').map((h1, i, arr) => (
                                        arr.slice(i + 1).map((h2) => (
                                            <line 
                                                key={`${h1.city}-${h2.city}`} 
                                                x1={h1.x} y1={h1.y} x2={h2.x} y2={h2.y} 
                                                stroke="hsl(var(--primary))" 
                                                strokeWidth="1" 
                                                strokeDasharray="4,4" 
                                            />
                                        ))
                                    ))}
                                </g>

                                {/* Live Mission Arcs */}
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
                                        <g key={mission.id}>
                                            <path 
                                                d={`M${from.x},${from.y} A${dr},${dr} 0 0,1 ${to.x},${to.y}`} 
                                                fill="none" 
                                                stroke="url(#lineGrad)" 
                                                strokeWidth="2" 
                                                strokeDasharray="10,10"
                                                className="animate-pulse"
                                            />
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
