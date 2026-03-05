'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import type { AircraftPosition, Aircraft } from "@/lib/types";
import { Radar, Plane, Globe, Activity, Clock, ShieldCheck, RefreshCw, Layers } from "lucide-react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// --- DYNAMIC MAP IMPORT ---
const RadarSurfaceMap = dynamic(() => import('./radar-surface-map').then(mod => mod.RadarSurfaceMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-950/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Synchronizing ADS-B Grid...</p>
    </div>
});

export default function GlobalCharterRadarPage() {
    const firestore = useFirestore();
    const [mounted, setMounted] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        setLastUpdate(new Date().toLocaleTimeString());
    }, []);

    const { data: positions, isLoading: positionsLoading } = useCollection<AircraftPosition>(null, 'aircraftPositions');
    const { data: aircraftRegistry } = useCollection<Aircraft>(null, 'aircrafts');

    const filteredPositions = useMemo(() => {
        if (!positions || !aircraftRegistry) return [];
        // Only show aircraft verified in our registry
        const registrations = new Set(aircraftRegistry.map(a => a.registration));
        return positions.filter(p => registrations.has(p.registration));
    }, [positions, aircraftRegistry]);

    const stats = useMemo(() => ({
        active: filteredPositions.filter(p => p.status === 'inflight').length,
        ready: filteredPositions.filter(p => p.status === 'available').length,
        scheduled: filteredPositions.filter(p => p.status === 'scheduled').length,
    }), [filteredPositions]);

    const handleRefresh = () => {
        setLastUpdate(new Date().toLocaleTimeString());
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Global Charter Radar" 
                description="Institutional ADS-B telemetry for verified network assets. Real-time positioning and operational state tracking."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Telemetry Pulse</p>
                        <p className="text-[10px] font-code text-sky-400 leading-none">{lastUpdate || 'Initializing...'}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-sky-500/20 bg-sky-500/5 text-sky-400 hover:bg-sky-500/10 font-bold text-[9px] tracking-widest uppercase">
                        <RefreshCw className="h-3.5 w-3.5" /> Force Scan
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* --- STATS SECTOR --- */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-card border-l-4 border-l-emerald-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase text-muted-foreground">Available Assets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.ready}</div>
                            <p className="text-[10px] text-emerald-500 uppercase font-bold mt-1">Ground Ready</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-l-4 border-l-rose-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase text-muted-foreground">Live Missions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.active}</div>
                            <p className="text-[10px] text-rose-500 uppercase font-bold mt-1">Active Air-time</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-l-4 border-l-amber-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs uppercase text-muted-foreground">Scheduled Tech</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.scheduled}</div>
                            <p className="text-[10px] text-amber-500 uppercase font-bold mt-1">Confirmed Blocks</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary" />
                                Radar Layers
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                                <span className="text-[10px] font-bold text-white">Demand Heatmap</span>
                                <Button 
                                    size="sm" 
                                    variant={showHeatmap ? "default" : "outline"} 
                                    onClick={() => setShowHeatmap(!showHeatmap)}
                                    className="h-6 text-[8px] font-black"
                                >
                                    {showHeatmap ? "ON" : "OFF"}
                                </Button>
                            </div>
                            <div className="p-3 bg-muted/20 rounded-lg italic text-[9px] text-muted-foreground">
                                * Data ingested via OpenSky Network protocol. 5-minute latency window active.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- MAP SECTOR --- */}
                <div className="lg:col-span-3 h-[600px] relative">
                    <RadarSurfaceMap positions={filteredPositions} showHeatmap={showHeatmap} />
                </div>
            </div>

            {/* --- TELEMETRY LOG --- */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-sky-400" />
                        Live ADS-B Telemetry Log
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[300px] overflow-y-auto px-6 pb-6">
                        <table className="w-full text-left text-[10px]">
                            <thead className="sticky top-0 bg-card z-10">
                                <tr className="border-b border-white/5">
                                    <th className="py-3 uppercase text-muted-foreground font-black">Registration</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black">Asset Class</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black">Altitude</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black">Velocity</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPositions.map(p => (
                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-3 font-bold text-sky-400 font-code">{p.registration}</td>
                                        <td className="py-3 text-white uppercase">{p.aircraftType}</td>
                                        <td className="py-3 text-muted-foreground font-code">{p.altitude.toLocaleString()} FT</td>
                                        <td className="py-3 text-muted-foreground font-code">{p.velocity} KT</td>
                                        <td className="py-3 text-right">
                                            <Badge className={cn(
                                                "text-[8px] h-4 font-black uppercase tracking-tighter border-none",
                                                p.status === 'inflight' ? 'bg-rose-500 text-white' : 
                                                p.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'
                                            )}>
                                                {p.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
