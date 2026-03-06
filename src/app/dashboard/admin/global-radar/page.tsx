'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/firebase";
import type { AircraftPosition } from "@/lib/types";
import { Radar, RefreshCw, Plane, Wind, MapPin, Activity } from "lucide-react";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";

// Dynamic Import for Map component
const RadarMap = dynamic(() => import('@/components/dashboard/admin/occ/occ-network-map').then(mod => mod.OCCNetworkMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-950 animate-pulse rounded-2xl border border-white/5" />
});

export default function GlobalRadarPage() {
    const [mounted, setMounted] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: positions, isLoading } = useCollection<AircraftPosition>(null, 'aircraftPositions');

    const handleRefresh = () => {
        setLastUpdate(new Date().toLocaleTimeString());
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Global Charter Radar" 
                description="Institutional ADS-B telemetry stream for verified network assets. Real-time positioning and operational state tracking."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Telemetry Sync</p>
                        <p className="text-[10px] font-code text-accent leading-none">{lastUpdate}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-accent/20 bg-accent/5 text-accent hover:bg-accent/10 font-bold text-[9px] tracking-widest uppercase">
                        <RefreshCw className="h-3.5 w-3.5" /> Re-Scan
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-[650px] relative">
                    <RadarMap />
                </div>

                <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[650px] pr-2 scrollbar-hide">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
                        <Activity className="h-3 w-3" /> Live Signal Stream
                    </h3>
                    
                    {positions?.map(pos => (
                        <Card key={pos.id} className="bg-card border-white/5 hover:border-accent/20 transition-all group">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-white uppercase font-code">{pos.registration}</p>
                                        <p className="text-[9px] text-muted-foreground font-bold uppercase">{pos.aircraftType}</p>
                                    </div>
                                    <Badge className={cn(
                                        "text-[8px] h-4 font-black uppercase border-none",
                                        pos.status === 'inflight' ? 'bg-rose-500 text-white animate-pulse' : 
                                        pos.status === 'available' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
                                    )}>
                                        {pos.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-3">
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Altitude</p>
                                        <p className="text-[10px] font-mono font-bold text-white">{pos.altitude.toLocaleString()} FT</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[8px] uppercase text-muted-foreground font-bold">Velocity</p>
                                        <p className="text-[10px] font-mono font-bold text-white">{pos.velocity} KT</p>
                                    </div>
                                </div>
                                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest pt-1">{pos.operator}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
