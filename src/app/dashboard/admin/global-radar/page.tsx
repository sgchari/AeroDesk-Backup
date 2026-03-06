'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/firebase";
import type { AircraftPosition, Aircraft } from "@/lib/types";
import { Radar, Activity, RefreshCw, Layers, Plane, Wind, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";

// --- DYNAMIC MAP IMPORT ---
const RadarSurfaceMap = dynamic(() => import('../global-charter-radar/radar-surface-map').then(mod => mod.RadarSurfaceMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-950/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Synchronizing ADS-B Grid...</p>
    </div>
});

export default function GlobalRadarPage() {
    const [mounted, setMounted] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        setLastUpdate(new Date().toLocaleTimeString());
    }, []);

    const { data: positions } = useCollection<AircraftPosition>(null, 'aircraftPositions');
    
    const stats = useMemo(() => ({
        active: positions?.filter(p => p.status === 'inflight').length || 0,
        available: positions?.filter(p => p.status === 'available').length || 0,
        scheduled: positions?.filter(p => p.status === 'scheduled').length || 0,
    }), [positions]);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Global Charter Radar" 
                description="Live ADS-B telemetry for institutional fleet assets. Real-time positioning, heading, and mission-state tracking."
            >
                <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold text-[9px] tracking-widest uppercase">
                    <RefreshCw className="h-3.5 w-3.5" /> Re-Sync Grid
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card className="bg-card border-l-4 border-l-rose-500 shadow-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">In-Flight Missions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.active}</div>
                            <p className="text-[9px] text-rose-500 font-bold uppercase mt-1">Live Telemetry Active</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-l-4 border-l-emerald-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Ground Ready</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white">{stats.available}</div>
                            <p className="text-[9px] text-emerald-500 font-bold uppercase mt-1">Hub Availability</p>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Layers className="h-4 w-4 text-primary" /> Radar Metadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2">
                                <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-muted-foreground font-bold uppercase">Protocol</span>
                                    <Badge variant="outline" className="text-[8px] h-4 border-accent/20 text-accent">ADS-B GRID</Badge>
                                </div>
                                <div className="flex items-center justify-between text-[9px]">
                                    <span className="text-muted-foreground font-bold uppercase">Latency</span>
                                    <span className="text-white font-code">120ms</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-muted-foreground leading-relaxed italic opacity-60">
                                * Aircraft icons rotate in real-time based on synchronized heading telemetry.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 h-[650px] relative">
                    <RadarSurfaceMap positions={positions || []} showHeatmap={false} />
                </div>
            </div>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-sky-400" />
                        Live Signal Stream
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="max-h-[300px] overflow-y-auto px-6 pb-6">
                        <table className="w-full text-left text-[10px]">
                            <thead className="sticky top-0 bg-card z-10 border-b border-white/5">
                                <tr>
                                    <th className="py-3 uppercase text-muted-foreground font-black tracking-widest">Registration</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black tracking-widest">Asset Class</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black tracking-widest">Altitude</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black tracking-widest">Velocity</th>
                                    <th className="py-3 uppercase text-muted-foreground font-black tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {positions?.map(p => (
                                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 font-bold text-sky-400 font-code uppercase">{p.registration}</td>
                                        <td className="py-3 text-white uppercase font-medium">{p.aircraftType}</td>
                                        <td className="py-3 text-muted-foreground font-code flex items-center gap-1.5">
                                            <Wind className="h-2.5 w-2.5 text-white/20" />
                                            {p.altitude.toLocaleString()} FT
                                        </td>
                                        <td className="py-3 text-muted-foreground font-code">{p.velocity} KT</td>
                                        <td className="py-3 text-right">
                                            <Badge className={cn(
                                                "text-[8px] h-4 font-black uppercase tracking-tighter border-none",
                                                p.status === 'inflight' ? 'bg-rose-500 text-white animate-pulse' : 
                                                p.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                                            )}>
                                                {p.status === 'inflight' ? 'IN FLIGHT' : p.status.toUpperCase()}
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
