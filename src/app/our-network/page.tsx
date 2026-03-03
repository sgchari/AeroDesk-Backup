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
import { Info, ShieldCheck, Zap, Plane, Users, Globe, Activity, MapPin } from 'lucide-react';

// Institutional Hub Mapping (SVG Coordinate System 1000x1000 for accurate India proportions)
const hubCoordinates: Record<string, { x: number; y: number; airport: string }> = {
    'Delhi': { x: 440, y: 240, airport: 'VIDP' },
    'Chandigarh': { x: 430, y: 180, airport: 'VICG' },
    'Lucknow': { x: 540, y: 320, airport: 'VILK' },
    'Jaipur': { x: 380, y: 330, airport: 'VIJP' },
    'Mumbai': { x: 280, y: 600, airport: 'VABB' },
    'Ahmedabad': { x: 260, y: 480, airport: 'VAAH' },
    'Pune': { x: 310, y: 640, airport: 'VAPO' },
    'Goa': { x: 320, y: 740, airport: 'VOGO' },
    'Bengaluru': { x: 430, y: 800, airport: 'VOBL' },
    'Hyderabad': { x: 470, y: 670, airport: 'VOHS' },
    'Chennai': { x: 520, y: 830, airport: 'VOMM' },
    'Cochin': { x: 410, y: 900, airport: 'VOCI' },
    'Kolkata': { x: 780, y: 500, airport: 'VECC' },
    'Bhubaneswar': { x: 710, y: 600, airport: 'VEBS' },
    'Bhopal': { x: 460, y: 480, airport: 'VABP' },
    'Nagpur': { x: 510, y: 560, airport: 'VANP' },
    'Guwahati': { x: 880, y: 380, airport: 'VEGT' },
};

// High-fidelity India path scaled to 1000x1000
const indiaPath = "M450,50 L480,80 L500,120 L520,150 L550,200 L600,220 L650,250 L750,300 L850,320 L920,350 L900,400 L850,420 L800,450 L750,500 L700,600 L650,700 L550,850 L450,950 L350,850 L300,750 L250,650 L200,550 L150,450 L180,400 L250,380 L350,350 L400,250 L420,150 L430,80 Z";

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
    const metrics = useMemo(() => {
        const approved = operators || [];
        const inProgress = rfqs?.filter(r => ['operationalPreparation', 'boarding', 'departed', 'arrived'].includes(r.status)) || [];
        return {
            activeOperators: approved.length,
            totalFleet: 124, 
            emptyLegs: emptyLegs?.length || 0,
            activeMissions: inProgress.length
        };
    }, [operators, rfqs, emptyLegs]);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA] overflow-hidden flex flex-col">
            {/* Background Layer with Frosted Effect */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Aviation Background"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex flex-col flex-1 bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
                    
                    {/* Left Panel: Network Summary */}
                    <div className="w-full lg:w-72 p-5 z-20 flex flex-col gap-5 bg-black/30 backdrop-blur-3xl border-r border-white/5 overflow-y-auto">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight font-headline">Network</h1>
                            <p className="text-accent font-black text-[9px] uppercase tracking-[0.2em]">Institutional Hubs</p>
                            <p className="text-muted-foreground text-[11px] leading-relaxed pt-1">
                                India's private aviation infrastructure, coordinated in real-time.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <Users className="h-3 w-3 text-emerald-500 mb-1" />
                                <p className="text-lg font-black text-white">{opsLoading ? '...' : metrics.activeOperators}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Operators</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-accent/30 transition-all">
                                <Plane className="h-3 w-3 text-accent mb-1" />
                                <p className="text-lg font-black text-white">{metrics.totalFleet}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Aircraft</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-primary/30 transition-all">
                                <Globe className="h-3 w-3 text-primary mb-1" />
                                <p className="text-lg font-black text-white">Hubs</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Coverage</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-400/30 transition-all">
                                <Zap className="h-3 w-3 text-emerald-400 mb-1" />
                                <p className="text-lg font-black text-white">{metrics.emptyLegs}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Empty Legs</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-accent/5 border border-accent/10">
                                <p className="text-[8px] font-black uppercase text-accent tracking-[0.2em] mb-1">Status Protocol</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] text-muted-foreground uppercase font-bold">Network Operational</span>
                                </div>
                            </div>
                            
                            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Active Missions</span>
                                </div>
                                <p className="text-xl font-black text-white">{metrics.activeMissions}</p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest justify-center">
                                <ShieldCheck className="h-3 w-3 text-accent" />
                                Secure Feed Active
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Interactive Map View */}
                    <div className="relative flex-1 bg-black/10 overflow-hidden flex items-center justify-center p-4">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                        
                        {/* Status Strip */}
                        <div className="absolute top-4 right-4 z-30 flex gap-2">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Nodes Live</span>
                                </div>
                                <div className="w-px h-2.5 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-2.5 w-2.5 text-accent" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Secured</span>
                                </div>
                            </div>
                        </div>

                        {/* Map Viewport */}
                        <div className="relative w-full h-full max-w-[900px] max-h-[900px] flex items-center justify-center">
                            <svg viewBox="0 0 1000 1000" className="w-full h-full overflow-visible">
                                <defs>
                                    <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                                        <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#ffffff" result="specOut">
                                            <fePointLight x="-5000" y="-10000" z="20000" />
                                        </feSpecularLighting>
                                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
                                        <feMerge>
                                            <feMergeNode in="offsetBlur" />
                                            <feMergeNode in="litPaint" />
                                        </feMerge>
                                    </filter>
                                    <radialGradient id="mapGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="rgba(255,255,189,0.05)" />
                                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                    </radialGradient>
                                </defs>

                                {/* India Silhouette - Accurate High-Fidelity Path */}
                                <path 
                                    d={indiaPath} 
                                    fill="url(#mapGradient)"
                                    stroke="rgba(255,255,189,0.15)"
                                    strokeWidth="2"
                                    filter="url(#emboss)"
                                    className="opacity-60"
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
                                                            r="4" 
                                                            fill="#1DBF73" 
                                                            className="filter drop-shadow-[0_0_8px_#1DBF73]" 
                                                        />
                                                        <text 
                                                            x={coords.x + 12} 
                                                            y={coords.y + 4} 
                                                            fill="white" 
                                                            className="text-[10px] font-black pointer-events-none opacity-40 group-hover/marker:opacity-100 transition-opacity uppercase tracking-tighter"
                                                        >
                                                            {city}
                                                        </text>
                                                    </g>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-[#0D1B2A] border-white/10 text-white p-4 shadow-2xl">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <h4 className="font-black uppercase tracking-widest text-xs">{city} Hub</h4>
                                                            <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-500">{coords.airport}</Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {hubOps.map(op => (
                                                                <div key={op.id} className="flex items-center justify-between gap-6 text-[10px]">
                                                                    <span className="font-bold">{op.companyName}</span>
                                                                    <span className="text-muted-foreground">Operational</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </TooltipProvider>

                                {/* Sample Operational Route Arcs */}
                                <path d="M440 240 Q 350 400, 280 600" fill="none" stroke="rgba(255, 255, 189, 0.05)" strokeWidth="1" strokeDasharray="4,4" />
                                <path d="M440 240 Q 550 500, 430 800" fill="none" stroke="rgba(255, 255, 189, 0.05)" strokeWidth="1" strokeDasharray="4,4" />
                            </svg>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}