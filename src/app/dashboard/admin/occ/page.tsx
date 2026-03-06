'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { 
    Radar, 
    Plane, 
    Zap, 
    Target, 
    History, 
    Activity, 
    ShieldCheck, 
    RefreshCw,
    Coins,
    Globe,
    Network,
    MousePointer2,
    TrendingUp
} from "lucide-react";
import dynamic from 'next/dynamic';
import { useCollection } from "@/firebase";
import type { CharterRFQ, AircraftPosition, AircraftAvailability, EmptyLeg, OperationalActivity, CharterPriceIndex } from "@/lib/types";
import { OperationalFeed } from "@/components/dashboard/admin/occ/operational-feed";
import { AIIntelligenceHub } from '@/components/dashboard/admin/occ/ai-intelligence-hub';
import Link from 'next/link';

const OCCNetworkMap = dynamic(() => import('@/components/dashboard/admin/occ/occ-network-map').then(mod => mod.OCCNetworkMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initializing Command Interface...</p>
    </div>
});

export default function OperationsControlCenterPage() {
    const [mounted, setMounted] = useState(false);
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        setMounted(true);
    }, []);

    // --- DATA SUBSCRIPTIONS ---
    const { data: positions } = useCollection<AircraftPosition>(null, 'aircraftPositions');
    const { data: availability } = useCollection<AircraftAvailability>(null, 'aircraftAvailability');
    const { data: legs } = useCollection<EmptyLeg>(null, 'emptyLegs');
    const { data: activities } = useCollection<OperationalActivity>(null, 'operationalActivities');
    const { data: cpi } = useCollection<CharterPriceIndex>(null, 'charterPriceIndex');

    const stats = useMemo(() => ({
        activeCharters: positions?.filter(p => p.status === 'inflight').length || 0,
        availableJets: availability?.length || 0,
        predictedEmptyLegs: legs?.filter(l => l.status === 'live').length || 0,
        seatBookings: activities?.filter(a => a.type === 'seat_booked').length || 0
    }), [positions, availability, legs, activities]);

    const handleRefresh = () => {
        setLastSync(new Date().toLocaleTimeString());
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="AeroDesk OCC Terminal" 
                description="Institutional Operations Control Center. Real-time situational awareness, AI advisory, and global data audit."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Grid Sync</p>
                        <p className="text-[10px] font-code text-emerald-400 leading-none">{lastSync}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[9px] tracking-widest uppercase">
                        <RefreshCw className="h-3.5 w-3.5" /> Force Scan
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Active Charters" value={stats.activeCharters.toString()} icon={Radar} description="Missions in flight" />
                <StatsCard title="Available Jets" value={stats.availableJets.toString()} icon={Plane} description="Ready nodes" />
                <StatsCard title="Predicted Empty Legs" value={stats.predictedEmptyLegs.toString()} icon={Zap} description="AI identified" />
                <StatsCard title="Seat Exchange Activity" value={stats.seatBookings.toString()} icon={Activity} description="Allocations today" />
            </StatsGrid>

            {/* --- AI INTELLIGENCE HUB (NEW) --- */}
            <AIIntelligenceHub />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* --- SECTOR 1: INTELLIGENCE MAP --- */}
                <div className="lg:col-span-8 h-[600px] relative">
                    <OCCNetworkMap />
                </div>

                {/* --- SECTOR 2: OPERATIONAL FEED --- */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="bg-card h-full flex flex-col border-white/5 shadow-2xl">
                        <CardHeader className="pb-2 border-b border-white/5 bg-black/20">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-accent" />
                                Operational Signal Stream
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-tighter">Real-time institutional coordination logs.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <OperationalFeed activities={activities || []} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- CHARTER PRICE INDEX PREVIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-primary flex items-center gap-2">
                            <Target className="h-4 w-4" /> AI Demand Advisor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            "High-yield cluster identified for BOM-GOI sector. Suggest prioritizing heavy-jet positionings for the next 72h."
                        </p>
                        <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary">CONFIDENCE: 92%</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-accent/5 border-accent/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-accent flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-accent" />
                            Compliance Guard
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            "All active missions are currently synchronized with operator NSOP certificates. 0 alerts flagged in current dispatch cycle."
                        </p>
                        <Badge variant="outline" className="text-[8px] font-black border-accent/20 text-accent">SYSTEM: SECURE</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-white flex items-center gap-2">
                            <Globe className="h-4 w-4 text-white" />
                            Global Positioning
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">VABB Hub</span>
                            <span className="font-bold text-emerald-500">OPERATIONAL</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">VIDP Hub</span>
                            <span className="font-bold text-emerald-500">OPERATIONAL</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <span className="text-muted-foreground">OMDB (Dubai)</span>
                            <span className="font-bold text-blue-400">HIGH TRAFFIC</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- QUICK ACCESS UTILITIES --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-sky-500/10 hover:border-sky-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/global-radar"><Radar className="h-4 w-4 text-sky-400" /> Access Global Radar</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/jet-availability"><Network className="h-4 w-4 text-amber-400" /> Availability Matrix</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-accent/10 hover:border-accent/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/cpi"><TrendingUp className="h-4 w-4 text-accent" /> Price Index (CPI)</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-primary/10 hover:border-primary/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/audit-trail"><History className="h-4 w-4 text-primary" /> Immutable Audit</Link>
                </Button>
            </div>
        </div>
    );
}
