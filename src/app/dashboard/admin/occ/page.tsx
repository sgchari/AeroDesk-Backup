'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { 
    Radio, 
    Plane, 
    MapPin, 
    ShieldCheck, 
    Zap, 
    Target, 
    Activity, 
    AlertTriangle, 
    History, 
    GanttChartSquare, 
    Users, 
    Clock, 
    Coins,
    BarChart3,
    CheckCircle2,
    RefreshCw,
    Search
} from "lucide-react";
import dynamic from 'next/dynamic';
import { useCollection, useFirestore } from "@/firebase";
import type { CharterRFQ, Aircraft, EmptyLeg, SystemAlert, SystemLog, User } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// --- DYNAMIC IMPORTS FOR MAP SAFETY ---
const OCCNetworkMap = dynamic(() => import('@/components/dashboard/admin/occ/occ-network-map').then(mod => mod.OCCNetworkMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initializing Radar Interface...</p>
    </div>
});

export default function OperationsControlCenterPage() {
    const firestore = useFirestore();
    const [mounted, setMounted] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        setLastSync(new Date().toLocaleTimeString());
    }, []);

    // --- DATA SUBSCRIPTIONS ---
    const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(null, 'charterRequests');
    const { data: aircrafts, isLoading: fleetLoading } = useCollection<Aircraft>(null, 'aircrafts');
    const { data: emptyLegs, isLoading: elLoading } = useCollection<EmptyLeg>(null, 'emptyLegs');
    const { data: alerts } = useCollection<SystemAlert>(null, 'alerts');
    const { data: logs } = useCollection<SystemLog>(null, 'systemLogs');
    const { data: users } = useCollection<User>(null, 'users');

    const isLoading = rfqsLoading || fleetLoading || elLoading;

    // --- COMPUTED ANALYTICS ---
    const activeMissions = useMemo(() => rfqs?.filter(r => ['departed', 'live', 'enroute', 'boarding'].includes(r.status)) || [], [rfqs]);
    const fleetStats = useMemo(() => ({
        total: aircrafts?.length || 0,
        available: aircrafts?.filter(a => a.status === 'Available').length || 0,
        flying: activeMissions.length,
        maintenance: aircrafts?.filter(a => ['Under Maintenance', 'AOG'].includes(a.status)).length || 0
    }), [aircrafts, activeMissions]);

    const dailyMetrics = useMemo(() => ({
        users: 142, // Simulated live users
        chartersToday: rfqs?.filter(r => r.createdAt.startsWith(new Date().toISOString().split('T')[0])).length || 0,
        quotations: 24, // Simulated
        seatBookings: emptyLegs?.filter(e => e.status === 'Published').length || 0
    }), [rfqs, emptyLegs]);

    const handleRefresh = () => {
        setLastSync(new Date().toLocaleTimeString());
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="AeroDesk OCC" 
                description="Institutional Operations Control Center. Global situational awareness and mission-level oversight."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Radar Sync</p>
                        <p className="text-[10px] font-code text-emerald-400 leading-none">{lastSync || 'Initializing...'}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[9px] tracking-widest uppercase">
                        <RefreshCw className="h-3.5 w-3.5" /> Re-Scan Network
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Active Missions" value={isLoading ? <Skeleton className="h-6 w-12" /> : activeMissions.length.toString()} icon={Plane} description="Aircraft currently en-route" />
                <StatsCard title="Fleet Availability" value={isLoading ? <Skeleton className="h-6 w-12" /> : `${fleetStats.available}/${fleetStats.total}`} icon={Activity} description="Ready for dispatch" />
                <StatsCard title="Network Demand" value={isLoading ? <Skeleton className="h-6 w-12" /> : dailyMetrics.chartersToday.toString()} icon={Target} description="RFQs initialized today" />
                <StatsCard title="System Integrity" value="99.9%" icon={ShieldCheck} description="Nodes online" />
            </StatsGrid>

            {/* --- CENTRAL COMMAND GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- SECTOR 1: MAP COMMAND (LEFT/CENTER) --- */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-card border-white/5 overflow-hidden">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Radio className="h-4 w-4 text-emerald-400" />
                                    National Aviation Network Radar
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase">Telemetry synchronized from verified NSOP fleet assets.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">LIVE TELEMETRY</Badge>
                                <Badge variant="outline" className="text-[8px] border-amber-500/30 text-amber-400 bg-amber-500/5">SECTOR ALERTS</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-[16/9] lg:aspect-[21/9] w-full relative">
                                <OCCNetworkMap />
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- CHARTER STATUS PANEL --- */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <GanttChartSquare className="h-4 w-4 text-sky-400" />
                                Real-Time Charter Status Registry
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[9px] uppercase font-black">Mission ID</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Route</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Operator</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right text-[9px] uppercase font-black pr-6">ETA</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rfqs?.slice(0, 6).map((rfq) => (
                                            <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                <TableCell className="font-code text-[10px] font-bold text-sky-400 py-3">{rfq.id}</TableCell>
                                                <TableCell className="text-[11px] font-medium">
                                                    {rfq.departure.split('(')[0]} → {rfq.arrival.split('(')[0]}
                                                </TableCell>
                                                <TableCell className="text-[10px] text-muted-foreground uppercase font-bold">{rfq.operatorId || 'Pending'}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "text-[8px] h-4 px-1.5 uppercase font-black border-none",
                                                        rfq.status === 'live' ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/10 text-muted-foreground'
                                                    )}>
                                                        {rfq.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 font-code text-[10px] text-muted-foreground">
                                                    {rfq.status === 'live' ? 'En Route' : '---'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- SECTOR 2: INTELLIGENCE & HEALTH (RIGHT) --- */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* FLEET RADAR */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Radio className="h-4 w-4 text-amber-400" />
                                Fleet Radar (Distribution)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                    <p className="text-[8px] uppercase font-black text-muted-foreground mb-1">Flying</p>
                                    <p className="text-xl font-black text-white">{fleetStats.flying}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                    <p className="text-[8px] uppercase font-black text-muted-foreground mb-1">AOG/Maint</p>
                                    <p className="text-xl font-black text-rose-500">{fleetStats.maintenance}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {aircrafts?.slice(0, 3).map(ac => (
                                    <div key={ac.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5 group hover:border-sky-500/30 transition-all">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-white uppercase">{ac.registration}</p>
                                            <p className="text-[8px] text-muted-foreground uppercase">{ac.type} • {ac.operatorId}</p>
                                        </div>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            ac.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'
                                        )} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* DEMAND INTELLIGENCE */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Charter Demand Hotspots
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            {[
                                { route: 'Mumbai → Goa', volume: 'Critical', growth: '+22%' },
                                { route: 'Delhi → London', volume: 'High', growth: '+15%' },
                                { route: 'Bangalore → Hyderabad', volume: 'Stable', growth: '0%' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5">
                                    <span className="text-[10px] font-bold text-white">{item.route}</span>
                                    <div className="flex gap-3">
                                        <span className="text-[8px] font-black uppercase text-sky-400">{item.volume}</span>
                                        <span className="text-[8px] font-black text-emerald-400">{item.growth}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* PLATFORM HEALTH */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                Infrastructure Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            {[
                                { name: 'Authentication Protocol', status: 'Healthy' },
                                { name: 'Firestore Grid', status: 'Healthy' },
                                { name: 'Storage Gateway', status: 'Warning' },
                                { name: 'Edge Functions', status: 'Healthy' }
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-muted-foreground uppercase">{service.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-[8px] uppercase">{service.status}</span>
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            service.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* ACTIVITY STREAM */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                Operational Signal Stream
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[250px] overflow-y-auto px-6 pb-6 space-y-4">
                                {logs?.slice(0, 8).map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1">
                                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-sky-500/40" />
                                        <p className="text-[10px] font-bold text-white uppercase">{log.event.replace('_', ' ')}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight italic">"{log.action}"</p>
                                        <p className="text-[8px] text-muted-foreground/60 uppercase font-code">
                                            {new Date(log.timestamp).toLocaleTimeString()} • {log.userId.slice(0, 8)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* --- QUICK COMMAND ACTIONS --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
                <Button variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-sky-500/10 hover:border-sky-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <ShieldCheck className="h-4 w-4 text-sky-400" /> Verify NSOP Holders
                </Button>
                <Button variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <AlertTriangle className="h-4 w-4 text-amber-400" /> Compliance Audit
                </Button>
                <Button variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Coins className="h-4 w-4 text-emerald-400" /> Settlement Review
                </Button>
                <Button variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <History className="h-4 w-4 text-rose-400" /> Access Root Logs
                </Button>
            </div>
        </div>
    );
}
