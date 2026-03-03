'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { CharterRFQ } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Plane, Building2, ShieldCheck, Zap } from 'lucide-react';
import { hubGeographics, indiaGeoJson } from '@/lib/geo-utils';
import * as d3Geo from 'd3-geo';

const VIEWBOX_SIZE = 1000;

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const [hoveredHub, setHoveredHub] = useState<string | null>(null);

    // --- GEOGRAPHIC PROJECTION ENGINE (D3-GEO) ---
    const projection = useMemo(() => {
        // Strict Mercator Projection calibrated to India's Mainland
        return d3Geo.geoMercator().fitSize([VIEWBOX_SIZE, VIEWBOX_SIZE], indiaGeoJson);
    }, []);

    const pathGenerator = useMemo(() => {
        return d3Geo.geoPath().projection(projection);
    }, [projection]);

    const indiaPath = useMemo(() => {
        return pathGenerator(indiaGeoJson);
    }, [pathGenerator]);

    // Data Fetching
    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'charterRequests');
    }, [firestore]);

    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const liveMissionsList = useMemo(() => {
        return rfqs?.filter(r => ['departed', 'live', 'enroute', 'arrived'].includes(r.status)) || [];
    }, [rfqs]);

    const hubs = useMemo(() => {
        return Object.entries(hubGeographics).map(([city, data]) => {
            const [x, y] = projection([data.lng, data.lat]) || [0, 0];
            return { city, x, y, ...data };
        });
    }, [projection]);

    return (
        <div className="w-full relative h-screen max-h-screen bg-[#0B1220] flex flex-col overflow-hidden">
            {/* Ambient Atmosphere Layer */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Background"
                    fill
                    priority
                    className="object-cover opacity-5 blur-3xl"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-aviation-radial opacity-90" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
                    
                    {/* Left Intelligence Column (35%) */}
                    <div className="w-full lg:w-[35%] p-6 md:p-12 flex flex-col justify-center gap-8 z-20 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Spatial Engine Calibrated</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline text-white leading-[0.9]">
                                NATIONAL <br />
                                <span className="text-accent">INFRASTRUCTURE</span> <br />
                                GRID
                            </h1>
                            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                                Precision geographic visualization of AeroDesk's aviation backbone. Telemetry synced with DGCA corridors and NSOP operator bases.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">Sectors</p>
                                <p className="text-2xl font-black text-white">{hubs.length}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">Fleet Ready</p>
                                <p className="text-2xl font-black text-white">42+</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">Active</p>
                                <p className="text-2xl font-black text-emerald-500">{liveMissionsList.length}</p>
                            </div>
                        </div>

                        <div className="p-5 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl space-y-4 max-w-sm">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Institutional Legend</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-accent" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Backbone Hub (L3)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">NSOP Operator Base</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Spatial Map Sector (65%) */}
                    <div className="flex-1 relative h-full w-full flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-black/10">
                        <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
                            
                            <svg 
                                viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
                                preserveAspectRatio="xMidYMid meet"
                                className="w-full h-full overflow-visible drop-shadow-[0_0_80px_rgba(14,165,233,0.05)]"
                            >
                                <defs>
                                    <pattern id="dotMatrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <circle cx="2" cy="2" r="0.8" fill="rgba(14, 165, 233, 0.15)" />
                                    </pattern>
                                    <linearGradient id="missionFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="50%" stopColor="#FFFFBD" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                    <filter id="neonGlow">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Geographic India Outline */}
                                <path 
                                    d={indiaPath || ''} 
                                    fill="rgba(14, 165, 233, 0.02)" 
                                    stroke="rgba(14, 165, 233, 0.3)" 
                                    strokeWidth="2" 
                                    filter="url(#neonGlow)"
                                    className="transition-all duration-1000"
                                />
                                
                                {/* Internal Grid (Clipped to India) */}
                                <g clipPath="url(#indiaClip)">
                                    <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill="url(#dotMatrix)" />
                                </g>
                                <clipPath id="indiaClip">
                                    <path d={indiaPath || ''} />
                                </clipPath>

                                {/* Strategic Backbone Corridors */}
                                <g className="opacity-[0.08]">
                                    {hubs.filter(h => h.type === 'backbone').map((h1, i, arr) => (
                                        arr.slice(i + 1).map((h2) => (
                                            <line 
                                                key={`${h1.city}-${h2.city}`} 
                                                x1={h1.x} y1={h1.y} x2={h2.x} y2={h2.y} 
                                                stroke="hsl(var(--primary))" 
                                                strokeWidth="1" 
                                                strokeDasharray="10,10" 
                                            />
                                        ))
                                    ))}
                                </g>

                                {/* Geographic Hub Markers */}
                                {hubs.map((hub) => (
                                    <g 
                                        key={hub.city}
                                        className="cursor-pointer group/marker"
                                        onMouseEnter={() => setHoveredHub(hub.city)}
                                        onMouseLeave={() => setHoveredHub(null)}
                                    >
                                        <circle cx={hub.x} cy={hub.y} r="15" fill="transparent" />
                                        
                                        {hub.type === 'backbone' ? (
                                            <g>
                                                <path 
                                                    d={`M${hub.x},${hub.y - 10} L${hub.x + 8},${hub.y + 6} L${hub.x - 8},${hub.y + 6} Z`} 
                                                    fill="#FFFFBD" 
                                                    className={cn("transition-transform duration-300", hoveredHub === hub.city ? "scale-150" : "scale-100")}
                                                />
                                                <path 
                                                    d={`M${hub.x},${hub.y - 10} L${hub.x + 8},${hub.y + 6} L${hub.x - 8},${hub.y + 6} Z`} 
                                                    fill="#FFFFBD" 
                                                    className="animate-ping opacity-20"
                                                />
                                            </g>
                                        ) : (
                                            <g>
                                                <rect 
                                                    x={hub.x - 5} y={hub.y - 5} width="10" height="10" 
                                                    fill="#10B981" 
                                                    className={cn("transition-transform duration-300", hoveredHub === hub.city ? "scale-150" : "scale-100")}
                                                />
                                                <rect 
                                                    x={hub.x - 5} y={hub.y - 5} width="10" height="10" 
                                                    fill="#10B981" 
                                                    className="animate-ping opacity-20"
                                                />
                                            </g>
                                        )}
                                    </g>
                                ))}

                                {/* Real-time Mission Telemetry Arcs */}
                                {liveMissionsList.map(mission => {
                                    const depCity = mission.departure.split(' (')[0];
                                    const arrCity = mission.arrival.split(' (')[0];
                                    const dep = hubs.find(h => h.city === depCity);
                                    const arr = hubs.find(h => h.city === arrCity);
                                    
                                    if (!dep || !arr) return null;
                                    
                                    const dx = arr.x - dep.x;
                                    const dy = arr.y - dep.y;
                                    const dr = Math.sqrt(dx * dx + dy * dy);
                                    
                                    return (
                                        <g key={mission.id} className="pointer-events-none">
                                            <path 
                                                d={`M${dep.x},${dep.y} A${dr},${dr} 0 0,1 ${arr.x},${arr.y}`} 
                                                fill="none" 
                                                stroke="url(#missionFlow)" 
                                                strokeWidth="2" 
                                                strokeDasharray="8,8"
                                                className="animate-pulse"
                                            >
                                                <animate attributeName="stroke-dashoffset" from="160" to="0" dur="10s" repeatCount="indefinite" />
                                            </path>
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* Collision-Aware Data Cards */}
                            {hubs.map((hub) => {
                                const isRight = hub.x > VIEWBOX_SIZE / 2;
                                const isBottom = hub.y > VIEWBOX_SIZE / 2;
                                return (
                                    <div 
                                        key={hub.city}
                                        className={cn(
                                            "absolute z-50 transition-all duration-500 pointer-events-none",
                                            hoveredHub === hub.city ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                                        )}
                                        style={{ 
                                            left: `${(hub.x / VIEWBOX_SIZE) * 100}%`, 
                                            top: `${(hub.y / VIEWBOX_SIZE) * 100}%` 
                                        }}
                                    >
                                        <div className={cn(
                                            "relative w-64 bg-[#0B1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4",
                                            isRight ? "-translate-x-[105%]" : "translate-x-[5%]",
                                            isBottom ? "-translate-y-[105%]" : "translate-y-[5%]"
                                        )}>
                                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{hub.city} Sector</span>
                                                <Badge className="bg-white/5 border border-white/10 text-[8px] uppercase">{hub.type}</Badge>
                                            </div>
                                            <p className="text-xs font-bold text-white leading-tight">{hub.label}</p>
                                            <div className="grid grid-cols-2 gap-4 pt-1">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Fleet</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Plane className="h-3 w-3 text-accent" />
                                                        <span className="text-[11px] font-bold">{hub.operators} NSOP</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Stays</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 className="h-3 w-3 text-primary" />
                                                        <span className="text-[11px] font-bold">{hub.partners} Hubs</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                <p className="text-[9px] text-muted-foreground italic flex items-center gap-2">
                                                    <ShieldCheck className="h-2.5 w-2.5 text-accent/60" />
                                                    Validated Node
                                                </p>
                                                <span className="text-[8px] font-code text-primary uppercase animate-pulse">Live Link</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
            
            <div className="relative z-30">
                <LandingFooter />
            </div>
        </div>
    );
}