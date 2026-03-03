'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { CharterRFQ } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Plane, Building2, ShieldCheck, Zap } from 'lucide-react';
import { indiaPath, hubGeographics, project } from '@/lib/geo-utils';

const NetworkNodeMarker = ({ hub, isHovered, onHover }: { hub: any; isHovered: boolean; onHover: (hovered: boolean) => void }) => {
    const { x, y } = project(hub.lat, hub.lng);
    
    return (
        <g 
            className="cursor-pointer group/marker"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            {/* Visual Aura */}
            <circle cx={x} cy={y} r="20" fill="transparent" className="pointer-events-auto" />
            
            {hub.type === 'backbone' ? (
                <g>
                    {/* Pulsing Backbone Triangle (Muted Gold) */}
                    <path 
                        d={`M${x},${y - 10} L${x + 8},${y + 6} L${x - 8},${y + 6} Z`} 
                        fill="#FFFFBD" 
                        className={cn("transition-transform duration-300", isHovered ? "scale-125" : "scale-100")}
                    />
                    <path 
                        d={`M${x},${y - 10} L${x + 8},${y + 6} L${x - 8},${y + 6} Z`} 
                        fill="#FFFFBD" 
                        className="animate-ping opacity-20"
                    />
                </g>
            ) : (
                <g>
                    {/* Pulsing Base Square (Neon Green) */}
                    <rect 
                        x={x - 5} y={y - 5} width="10" height="10" 
                        fill="#10B981" 
                        className={cn("transition-transform duration-300", isHovered ? "scale-125" : "scale-100")}
                    />
                    <rect 
                        x={x - 5} y={y - 5} width="10" height="10" 
                        fill="#10B981" 
                        className="animate-ping opacity-20"
                    />
                </g>
            )}
        </g>
    );
};

const NetworkNodeCard = ({ hub, isHovered }: { hub: any; isHovered: boolean }) => {
    const { x, y } = project(hub.lat, hub.lng);
    
    // Quadrant-aware positioning: Determine which quadrant relative to viewbox center (500, 500)
    const isRightHalf = x > 500;
    const isBottomHalf = y > 500;

    return (
        <div 
            className={cn(
                "absolute z-50 transition-all duration-500 pointer-events-none",
                isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ 
                left: `${x / 10}%`, 
                top: `${y / 10}%` 
            }}
        >
            <div className={cn(
                "relative w-64 bg-[#0B1220]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4",
                isRightHalf ? "-translate-x-[105%]" : "translate-x-[15%]",
                isBottomHalf ? "-translate-y-[105%]" : "translate-y-[15%]"
            )}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">{hub.city} Sector</span>
                    <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-white/60 uppercase">
                        {hub.type} Node
                    </span>
                </div>
                <p className="text-xs font-bold text-white leading-tight">{hub.label}</p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Operators</p>
                        <div className="flex items-center gap-1.5">
                            <Plane className="h-3 w-3 text-accent" />
                            <span className="text-[11px] font-bold">{hub.operators} NSOP</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Partners</p>
                        <div className="flex items-center gap-1.5">
                            <Building2 className="h-3 w-3 text-primary" />
                            <span className="text-[11px] font-bold">{hub.partners} Stays</span>
                        </div>
                    </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] text-muted-foreground italic flex items-center gap-2">
                        <ShieldCheck className="h-2.5 w-2.5 text-accent/60" />
                        Synchronized
                    </p>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                        <span className="text-[8px] font-code text-primary uppercase">Live Feed</span>
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

    const liveMissionsList = useMemo(() => {
        return rfqs?.filter(r => ['departed', 'live', 'enroute', 'arrived'].includes(r.status)) || [];
    }, [rfqs]);

    const hubs = useMemo(() => {
        return Object.entries(hubGeographics).map(([city, data]) => ({
            city,
            ...data
        }));
    }, []);

    return (
        <div className="w-full relative min-h-screen bg-[#0B1220] flex flex-col overflow-hidden">
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

            <div className="relative z-10 flex flex-col flex-1 h-screen max-h-screen">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
                    
                    {/* Left Intelligence Column (35%) */}
                    <div className="w-full lg:w-[35%] p-6 md:p-12 flex flex-col justify-center gap-10 z-20">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Spatial Coordination Active</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline text-white leading-[0.9]">
                                THE <span className="text-accent">NATIONAL</span> <br />
                                INFRASTRUCTURE <br /> GRID
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
                                Precise geographic visualization of India's private aviation backbone through real-time hub synchronization and telemetry.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Active Hubs</p>
                                <p className="text-3xl font-black text-white">{hubs.length}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Fleet Ready</p>
                                <p className="text-3xl font-black text-white">42+</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Live Missions</p>
                                <p className="text-3xl font-black text-emerald-500">{liveMissionsList.length}</p>
                            </div>
                        </div>

                        {/* Professional Registry Index */}
                        <div className="p-6 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl space-y-5 max-w-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Registry Index</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-accent" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Backbone Coordination Hub</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">NSOP Operator Base</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Spatial Map Sector (65%) */}
                    <div className="flex-1 relative h-full w-full flex items-center justify-center p-4 lg:p-8 overflow-hidden">
                        <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center transition-all duration-1000">
                            
                            {/* Dynamic SVG Grid Layer */}
                            <div className="relative w-full h-full">
                                
                                {/* Absolute positioned tooltips based on projection */}
                                {hubs.map((hub) => (
                                    <NetworkNodeCard 
                                        key={hub.city} 
                                        hub={hub} 
                                        isHovered={hoveredHub === hub.city} 
                                    />
                                ))}

                                <svg 
                                    viewBox="0 0 1000 1000" 
                                    preserveAspectRatio="xMidYMid meet"
                                    className="w-full h-full overflow-visible drop-shadow-[0_0_80px_rgba(14,165,233,0.05)]"
                                >
                                    <defs>
                                        <pattern id="dotMatrix" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <circle cx="2" cy="2" r="0.8" fill="rgba(14, 165, 233, 0.15)" />
                                        </pattern>
                                        <clipPath id="indiaClip">
                                            <path d={indiaPath} />
                                        </clipPath>
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

                                    {/* Geographic Mainland Silhouette */}
                                    <path 
                                        d={indiaPath} 
                                        fill="rgba(14, 165, 233, 0.02)" 
                                        stroke="rgba(14, 165, 233, 0.3)" 
                                        strokeWidth="3" 
                                        filter="url(#neonGlow)"
                                        className="transition-all duration-1000"
                                    />
                                    
                                    {/* Internal Dotted Grid Overlay */}
                                    <rect width="1000" height="1000" fill="url(#dotMatrix)" clipPath="url(#indiaClip)" />

                                    {/* Backbone Strategic Corridors */}
                                    <g className="opacity-[0.08]">
                                        {hubs.filter(h => h.type === 'backbone').map((h1, i, arr) => (
                                            arr.slice(i + 1).map((h2) => {
                                                const p1 = project(h1.lat, h1.lng);
                                                const p2 = project(h2.lat, h2.lng);
                                                return (
                                                    <line 
                                                        key={`${h1.city}-${h2.city}`} 
                                                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                                                        stroke="hsl(var(--primary))" 
                                                        strokeWidth="1.5" 
                                                        strokeDasharray="8,8" 
                                                    />
                                                );
                                            })
                                        ))}
                                    </g>

                                    {/* Geographic Hub Markers */}
                                    {hubs.map((hub) => (
                                        <NetworkNodeMarker 
                                            key={hub.city} 
                                            hub={hub} 
                                            isHovered={hoveredHub === hub.city}
                                            onHover={(hovered) => setHoveredHub(hovered ? hub.city : null)}
                                        />
                                    ))}

                                    {/* Real-time Mission Telemetry Arcs */}
                                    {liveMissionsList.map(mission => {
                                        const depCity = mission.departure.split(' (')[0];
                                        const arrCity = mission.arrival.split(' (')[0];
                                        
                                        const fromCoords = hubGeographics[depCity];
                                        const toCoords = hubGeographics[arrCity];
                                        
                                        if (!fromCoords || !toCoords) return null;
                                        
                                        const p1 = project(fromCoords.lat, fromCoords.lng);
                                        const p2 = project(toCoords.lat, toCoords.lng);
                                        
                                        const dx = p2.x - p1.x;
                                        const dy = p2.y - p1.y;
                                        const dr = Math.sqrt(dx * dx + dy * dy);
                                        
                                        return (
                                            <g key={mission.id} className="pointer-events-none">
                                                <path 
                                                    d={`M${p1.x},${p1.y} A${dr},${dr} 0 0,1 ${p2.x},${p2.y}`} 
                                                    fill="none" 
                                                    stroke="url(#missionFlow)" 
                                                    strokeWidth="3" 
                                                    strokeDasharray="12,12"
                                                    className="animate-pulse"
                                                >
                                                    <animate attributeName="stroke-dashoffset" from="240" to="0" dur="8s" repeatCount="indefinite" />
                                                </path>
                                                <circle cx={p1.x} cy={p1.y} r="2.5" fill="white" className="opacity-60" />
                                                <circle cx={p2.x} cy={p2.y} r="2.5" fill="white" className="opacity-60" />
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
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
