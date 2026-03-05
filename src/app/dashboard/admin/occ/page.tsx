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
    RefreshCw,
    Search,
    Globe,
    Radar,
    Network
} from "lucide-react";
import dynamic from 'next/dynamic';
import { useCollection, useFirestore } from "@/firebase";
import type { CharterRFQ, Aircraft, EmptyLeg, SystemAlert, SystemLog, AircraftPosition, AircraftAvailability } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// --- DYNAMIC IMPORTS ---
const OCCNetworkMap = dynamic(() => import('@/components/dashboard/admin/occ/occ-network-map').then(mod => mod.OCCNetworkMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initializing Command Interface...</p>
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
    const { data: fleet, isLoading: fleetLoading } = useCollection<Aircraft>(null, 'aircrafts');
    const { data: emptyLegs } = useCollection<EmptyLeg>(null, 'emptyLegs');
    const { data: positions } = useCollection<AircraftPosition>(null, 'aircraftPositions');
    const { data: availability } = useCollection<AircraftAvailability>(null, 'aircraftAvailability');
    const { data: alerts } = useCollection<SystemAlert>(null, 'alerts');
    const { data: logs } = useCollection<SystemLog>(null, 'systemLogs');

    const isLoading = rfqsLoading || fleetLoading;

    // --- COMPUTED ANALYTICS ---
    const activeMissions = useMemo(() => rfqs?.filter(r => ['departed', 'live', 'enroute', 'boarding'].includes(r.status)) || [], [rfqs]);
    
    const handleRefresh = () => {
        setLastSync(new Date().toLocaleTimeString());
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="AeroDesk OCC" 
                description="Institutional Operations Control Center. Real-time situational awareness and cross-stakeholder governance."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Radar Sync</p>
                        <p className="text-[10px] font-code text-emerald-400 leading-none">{lastSync || 'Initializing...'}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 font-bold text-[9px] tracking-widest uppercase">
                        <RefreshCw className="h-3.5 w-3.5" /> Re-Scan Grid
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Global Radar" value={positions?.length.toString() || '0'} icon={Radar} description="Verified assets online" href="/dashboard/admin/global-charter-radar" />
                <StatsCard title="Ready to Depart" value={availability?.length.toString() || '0'} icon={Clock} description="0-12h availability" href="/dashboard/admin/jet-availability" />
                <StatsCard title="Active Missions" value={isLoading ? <Skeleton className="h-6 w-12" /> : activeMissions.length.toString()} icon={Plane} description="Aircraft currently en-route" />
                <StatsCard title="Network Demand" value={rfqs?.length.toString() || '0'} icon={Target} description="Total institutional leads" href="/dashboard/admin/demand-intelligence" />
            </StatsGrid>

            {/* --- CENTRAL COMMAND GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- SECTOR 1: MAP COMMAND (LEFT/CENTER) --- */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-card border-white/5 overflow-hidden shadow-2xl">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-emerald-400" />
                                    National Aviation Intelligence Map
                                </CardTitle>
                                <CardDescription className="text-[10px] uppercase">Curved route arcs and real-time telemetry overlays.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 bg-emerald-500/5">LIVE SIGNALS</Badge>
                                <Badge variant="outline" className="text-[8px] border-amber-500/30 text-amber-400 bg-amber-500/5">SECTOR LOAD</Badge>
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
                                Institutional Charter Registry
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[9px] uppercase font-black">Mission ID</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Sector</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Operator</TableHead>
                                            <TableHead className="text-[9px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right text-[9px] uppercase font-black pr-6">Activity</TableHead>
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
                                                        ['live', 'departed', 'arrived'].includes(rfq.status) ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white/10 text-muted-foreground'
                                                    )}>
                                                        {rfq.status}
                                                    </Badge>
                                                </TableCell>
                                                <td className="text-right pr-6">
                                                    <div className="w-2 h-2 rounded-full bg-sky-500/20 inline-block group-hover:bg-sky-500 transition-colors" />
                                                </td>
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
                    
                    {/* SYSTEM VITALITY */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-2 border-b border-white/5">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                Infrastructure Integrity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {[
                                { name: 'ADS-B Ingestion', status: 'Active' },
                                { name: 'Demand Engine', status: 'Healthy' },
                                { name: 'Availability Sync', status: 'Healthy' },
                                { name: 'Radar Protocol', status: 'Active' }
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                    <span className="font-bold text-muted-foreground uppercase">{service.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-[8px] uppercase">{service.status}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* REVENUE MONITOR */}
                    <Card className="bg-accent/5 border-accent/20 shadow-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Coins className="h-4 w-4 text-accent" />
                                Platform Revenue Pulse
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                                    <p className="text-[8px] uppercase font-black text-muted-foreground mb-1">GTV (MTD)</p>
                                    <p className="text-lg font-black text-white">₹ 4.2 Cr</p>
                                </div>
                                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
                                    <p className="text-[8px] uppercase font-black text-muted-foreground mb-1">Fees Capture</p>
                                    <p className="text-lg font-black text-accent">₹ 28.5 L</p>
                                </div>
                            </div>
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
                            <div className="max-h-[300px] overflow-y-auto px-6 pb-6 space-y-4">
                                {logs?.slice(0, 8).map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1">
                                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-emerald-500/40" />
                                        <p className="text-[10px] font-bold text-white uppercase">{log.event.replace('_', ' ')}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight italic">"{log.action}"</p>
                                        <p className="text-[8px] text-muted-foreground/60 uppercase font-code">
                                            {new Date(log.timestamp).toLocaleTimeString()}
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
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-sky-500/10 hover:border-sky-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/global-charter-radar"><Radar className="h-4 w-4 text-sky-400" /> Access Global Radar</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-amber-500/10 hover:border-amber-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/jet-availability"><Network className="h-4 w-4 text-amber-400" /> Availability Matrix</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/demand-intelligence"><Target className="h-4 w-4 text-rose-400" /> Demand Hotmapping</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 bg-white/[0.02] border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-[10px] font-black uppercase tracking-widest gap-2 transition-all">
                    <Link href="/dashboard/admin/audit-trail"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Compliance Audit</Link>
                </Button>
            </div>
        </div>
    );
}
