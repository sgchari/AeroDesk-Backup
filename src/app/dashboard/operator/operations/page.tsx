'use client';

import React, { useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import type { Aircraft, CharterRFQ, CrewMember, SystemAlert, OperationalActivity } from "@/lib/types";
import { 
    Activity, 
    Plane, 
    Users, 
    ShieldAlert, 
    Clock, 
    Zap, 
    GanttChartSquare, 
    ArrowRight,
    MapPin,
    AlertCircle,
    CheckCircle2,
    TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from 'next/link';

export default function OperatorOperationsCenterPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const opId = user?.operatorId || 'op-west-01';

    // Subscriptions
    const { data: fleet, isLoading: fleetLoading } = useCollection<Aircraft>(
        useMemoFirebase(() => null, []), 
        'aircrafts'
    );
    const { data: rfqs } = useCollection<CharterRFQ>(null, 'charterRequests');
    const { data: crew } = useCollection<CrewMember>(null, 'crewMembers');
    const { data: alerts } = useCollection<SystemAlert>(null, 'alerts');
    const { data: activities } = useCollection<OperationalActivity>(null, 'operationalActivities');

    const opFleet = useMemo(() => fleet?.filter(a => a.operatorId === opId) || [], [fleet, opId]);
    const opRfqs = useMemo(() => rfqs?.filter(r => r.status === 'Bidding Open' || r.status === 'New') || [], [rfqs]);
    const opCrew = useMemo(() => crew?.filter(c => c.operatorId === opId) || [], [crew, opId]);
    const activeMissions = useMemo(() => rfqs?.filter(r => r.operatorId === opId && ['Confirmed', 'boarding', 'departed', 'live', 'enroute', 'arrived'].includes(r.status)) || [], [rfqs, opId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-emerald-500';
            case 'IN_CHARTER': return 'bg-blue-500';
            case 'MAINTENANCE_DUE': return 'bg-amber-500';
            case 'MAINTENANCE': return 'bg-rose-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Operations Control Center (OCC)" 
                description={`Situational awareness and technical command for ${user?.company || 'Your Fleet'}.`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* --- FLEET STATUS (LEFT) --- */}
                <Card className="lg:col-span-1 bg-card border-white/5">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Plane className="h-4 w-4 text-accent" />
                            Fleet Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {fleetLoading ? <div className="p-4"><Skeleton className="h-20 w-full" /></div> : (
                                opFleet.map(ac => (
                                    <div key={ac.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-white group-hover:text-accent transition-colors">{ac.registration}</span>
                                            <Badge className={cn("text-[8px] font-black h-4 px-1.5", getStatusColor(ac.status))}>
                                                {ac.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-muted-foreground uppercase font-black">{ac.type}</span>
                                            <span className="text-[10px] text-white/60 flex items-center gap-1">
                                                <MapPin className="h-2.5 w-2.5" /> {ac.location || 'BOM'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* --- COMMAND FEED & TIMELINE (MIDDLE) --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Operational Alerts */}
                    <Card className="bg-rose-500/5 border-rose-500/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-rose-500 flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4" /> Operational Integrity Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {alerts?.filter(a => a.status === 'active').slice(0, 3).map(alert => (
                                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-rose-500/10">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", alert.severity === 'high' ? "bg-rose-500 animate-pulse" : "bg-amber-500")} />
                                        <p className="text-xs font-medium text-white/90">{alert.message}</p>
                                    </div>
                                    <span className="text-[9px] text-white/40 uppercase font-black">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Daily Timeline */}
                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Clock className="h-4 w-4 text-emerald-400" />
                                Today's Operations Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeMissions.length > 0 ? activeMissions.map(m => (
                                <div key={m.id} className="relative pl-6 pb-4 border-l border-white/5 last:pb-0">
                                    <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-accent/30 transition-all">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white uppercase">{m.departure.split(' (')[0]} → {m.arrival.split(' (')[0]}</span>
                                                <Badge variant="outline" className="text-[8px] h-4 uppercase border-accent/20 text-accent font-code">{m.id}</Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                                DEP: {m.departureTime} • ASSET: {m.aircraftId || 'TBD'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-blue-500/20 text-blue-400 border-none text-[9px] font-black uppercase tracking-widest">
                                                {m.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 opacity-30">
                                    <Clock className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">No scheduled missions for current cycle</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- RESOURCE PANELS (RIGHT) --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Active Market Leads */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <GanttChartSquare className="h-4 w-4 text-primary" />
                                Market Leads
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-white/5">
                                {opRfqs.map(rfq => (
                                    <div key={rfq.id} className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold text-white">{rfq.departure.split(' (')[0]} → {rfq.arrival.split(' (')[0]}</p>
                                            <span className="text-[9px] font-black text-primary">{rfq.pax} PAX</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] text-muted-foreground font-code uppercase">{rfq.id}</span>
                                            <Button variant="link" asChild className="p-0 h-auto text-[9px] font-black uppercase text-accent group">
                                                <Link href="/dashboard/operator/rfq-marketplace">
                                                    Bid <ArrowRight className="h-2.5 w-2.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Crew Readiness */}
                    <Card className="bg-card border-white/5">
                        <CardHeader className="pb-3 border-b border-white/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Users className="h-4 w-4 text-sky-400" />
                                Crew Logistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                                    <p className="text-[8px] uppercase text-muted-foreground font-black mb-1">Available</p>
                                    <p className="text-lg font-black text-emerald-500">{opCrew.filter(c => c.status === 'AVAILABLE' || c.status === 'ACTIVE').length}</p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                                    <p className="text-[8px] uppercase text-muted-foreground font-black mb-1">On Duty</p>
                                    <p className="text-lg font-black text-sky-400">{opCrew.filter(c => c.status === 'ON_DUTY').length}</p>
                                </div>
                            </div>
                            <Button variant="outline" asChild className="w-full h-8 text-[9px] font-bold uppercase border-white/10">
                                <Link href="/dashboard/operator/crew-operations">Dispatch Control</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Revenue Pulse */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Revenue Forecast (7D)</p>
                                <p className="text-xl font-black text-white">₹ 42.5 L</p>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[68%]" />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                                <span className="text-muted-foreground">Charters MTD: <span className="text-white">12</span></span>
                                <span className="text-accent flex items-center gap-1"><Zap className="h-3 w-3" /> ₹ 1.2 Cr</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}