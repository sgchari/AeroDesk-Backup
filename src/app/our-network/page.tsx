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

// Institutional Hub Mapping (SVG Coordinate System 1000x800)
const hubCoordinates: Record<string, { x: number; y: number; zone: string; airport: string }> = {
    'Delhi': { x: 480, y: 220, zone: 'North', airport: 'VIDP' },
    'Chandigarh': { x: 460, y: 160, zone: 'North', airport: 'VICG' },
    'Lucknow': { x: 580, y: 280, zone: 'North', airport: 'VILK' },
    'Jaipur': { x: 420, y: 300, zone: 'North', airport: 'VIJP' },
    'Mumbai': { x: 320, y: 580, zone: 'West', airport: 'VABB' },
    'Ahmedabad': { x: 300, y: 450, zone: 'West', airport: 'VAAH' },
    'Pune': { x: 360, y: 620, zone: 'West', airport: 'VAPO' },
    'Goa': { x: 380, y: 720, zone: 'West', airport: 'VOGO' },
    'Bengaluru': { x: 480, y: 780, zone: 'South', airport: 'VOBL' },
    'Hyderabad': { x: 520, y: 650, zone: 'South', airport: 'VOHS' },
    'Chennai': { x: 580, y: 820, zone: 'South', airport: 'VOMM' },
    'Cochin': { x: 450, y: 880, zone: 'South', airport: 'VOCI' },
    'Kolkata': { x: 820, y: 480, zone: 'East', airport: 'VECC' },
    'Bhubaneswar': { x: 750, y: 580, zone: 'East', airport: 'VEBS' },
    'Bhopal': { x: 500, y: 460, zone: 'Central', airport: 'VABP' },
    'Nagpur': { x: 550, y: 550, zone: 'Central', airport: 'VANP' },
    'Guwahati': { x: 920, y: 350, zone: 'North East', airport: 'VEGT' },
};

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const [hoveredOperator, setHoveredOperator] = useState<string | null>(null);

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
            totalFleet: 124, // In a real app, sum(operator.fleetCount)
            emptyLegs: emptyLegs?.length || 0,
            activeMissions: inProgress.length
        };
    }, [operators, rfqs, emptyLegs]);

    return (
        <div className="w-full relative min-h-screen text-[#EAEAEA]">
            {/* Background Layer with Frosted Effect: Optimized with next/image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1627440474139-65a5d1656f7e?q=80&w=2070&auto=format&fit=crop"
                    alt="Aviation Background"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="relative flex flex-col lg:flex-row h-full min-h-[calc(100vh-80px)] overflow-hidden">
                    
                    {/* Left Panel: Network Summary */}
                    <div className="w-full lg:w-[30%] p-6 lg:p-10 z-20 flex flex-col gap-8 bg-black/30 backdrop-blur-3xl border-r border-white/5">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight font-headline">Our Network</h1>
                            <p className="text-accent font-bold text-xs uppercase tracking-widest">Nationwide Network of Licensed Operators</p>
                            <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                                Integrated Infrastructure. Structured Coordination. Real-Time Fleet Visibility.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <Users className="h-4 w-4 text-emerald-500 mb-2" />
                                <p className="text-2xl font-black text-white">{opsLoading ? '...' : metrics.activeOperators}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Active Operators</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-accent/30 transition-all">
                                <Plane className="h-4 w-4 text-accent mb-2" />
                                <p className="text-2xl font-black text-white">{metrics.totalFleet}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Aircraft Fleet</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-primary/30 transition-all">
                                <Globe className="h-4 w-4 text-primary mb-2" />
                                <p className="text-2xl font-black text-white">Pan-India</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Service Coverage</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-emerald-400/30 transition-all">
                                <Zap className="h-4 w-4 text-emerald-400 mb-2" />
                                <p className="text-2xl font-black text-white">{metrics.emptyLegs}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Empty Legs Live</p>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                                <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-1">Institutional Standard</p>
                                <p className="text-xs text-muted-foreground italic">
                                    "Licensed Operators. Pan-India Operational Visibility. Guaranteed Institutional Coordination."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Interactive Map */}
                    <div className="relative flex-1 bg-black/20 overflow-hidden flex items-center justify-center">
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        {/* Status Strip */}
                        <div className="absolute top-6 right-6 z-30 flex gap-4">
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Active: {metrics.activeOperators}</span>
                                </div>
                                <div className="w-px h-3 bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-accent" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Missions: {metrics.activeMissions}</span>
                                </div>
                            </div>
                        </div>

                        {/* SVG Map of India */}
                        <div className="relative w-full h-full max-w-[900px] max-h-[700px] flex items-center justify-center transition-transform duration-700">
                            <svg viewBox="0 0 1000 800" className="w-full h-full filter drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                {/* Zonal Boundaries removed for unified view */}

                                {/* Operator Hub Markers */}
                                <TooltipProvider>
                                    {Object.entries(hubCoordinates).map(([city, coords]) => {
                                        const hubOps = operators?.filter(o => o.city === city) || [];
                                        if (hubOps.length === 0) return null;

                                        return (
                                            <Tooltip key={city}>
                                                <TooltipTrigger asChild>
                                                    <g 
                                                        className="cursor-pointer transition-opacity duration-500"
                                                        onMouseEnter={() => setHoveredOperator(city)}
                                                        onMouseLeave={() => setHoveredOperator(null)}
                                                    >
                                                        <circle cx={coords.x} cy={coords.y} r="12" fill="rgba(29, 191, 115, 0.2)" className="animate-ping" />
                                                        <circle cx={coords.x} cy={coords.y} r="6" fill="#1DBF73" className="filter drop-shadow-[0_0_8px_#1DBF73]" />
                                                        <text x={coords.x + 10} y={coords.y + 4} fill="white" className="text-[10px] font-black pointer-events-none opacity-60 uppercase tracking-tighter">{city}</text>
                                                    </g>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-[#0D1B2A] border-white/10 text-white p-4 shadow-2xl">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between gap-4">
                                                            <h4 className="font-black uppercase tracking-widest text-xs">{city} Operational Hub</h4>
                                                            <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-500">{coords.airport}</Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {hubOps.map(op => (
                                                                <div key={op.id} className="flex items-center justify-between gap-6 text-[10px]">
                                                                    <span className="font-bold">{op.companyName}</span>
                                                                    <span className="text-muted-foreground">Fleet Active</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <button className="w-full py-1.5 bg-accent text-accent-foreground text-[9px] font-black uppercase rounded mt-2 hover:opacity-90 transition-colors">
                                                            View Deployment Details
                                                        </button>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        );
                                    })}
                                </TooltipProvider>

                                {/* Decorative Animated Route Arcs (Subtle) */}
                                <path d="M480 220 Q 400 400, 320 580" fill="none" stroke="rgba(255, 255, 189, 0.15)" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
                                <path d="M480 220 Q 650 500, 480 780" fill="none" stroke="rgba(255, 255, 189, 0.15)" strokeWidth="1" strokeDasharray="5,5" className="animate-pulse" />
                            </svg>
                        </div>
                    </div>
                </main>

                <LandingFooter />
            </div>
        </div>
    );
}
