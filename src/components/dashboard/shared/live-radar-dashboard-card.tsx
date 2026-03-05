'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LiveTrackingMap } from '@/components/dashboard/charter/live-tracking-map';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Plane, Activity } from 'lucide-react';
import Link from 'next/link';
import { CharterRFQ } from '@/lib/types';

export function LiveRadarDashboardCard({ missions }: { missions: CharterRFQ[] }) {
    if (!missions || !missions.length) return null;

    const liveMissions = missions.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status));
    
    if (!liveMissions.length) return null;

    return (
        <Card className="bg-card border-accent/20 overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-1000 mb-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Activity className="h-40 w-40 -mr-12 -mt-12 text-accent" />
            </div>
            
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                            <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-accent">Active Network Signal</CardTitle>
                            <CardDescription className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Real-time situational awareness telemetry</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="font-code text-[9px] text-accent border-accent/20 bg-accent/5">
                            {liveMissions.length} MISSION{liveMissions.length > 1 ? 'S' : ''} ACTIVE
                        </Badge>
                        <Badge variant="outline" className="font-code text-[9px] text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                            NETWORK OPTIMAL
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <LiveTrackingMap 
                            origin={liveMissions[0].departure} 
                            destination={liveMissions[0].arrival} 
                        />
                    </div>
                    <div className="space-y-3 order-1 lg:order-2">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Live Telemetry Feed</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                            {liveMissions.slice(0, 3).map(mission => (
                                <Link key={mission.id} href={`/dashboard/charter/${mission.id}`} className="block">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-accent/30 transition-all group/item">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase font-code group-hover/item:text-accent transition-colors">{mission.id}</p>
                                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none h-4 text-[8px] font-black uppercase tracking-tighter px-1.5">
                                                {mission.status === 'arrived' ? 'TOUCHDOWN' : 'IN FLIGHT'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                                            <Plane className="h-3.5 w-3.5 text-accent/60" />
                                            <span className="truncate">{mission.departure.split(' (')[0]} → {mission.arrival.split(' (')[0]}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                            <p className="text-[8px] text-muted-foreground uppercase font-bold truncate max-w-[100px]">{mission.customerName}</p>
                                            <p className="text-[9px] text-accent flex items-center gap-1 font-bold uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                Terminal <ArrowRight className="h-2.5 w-2.5" />
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {liveMissions.length > 3 && (
                            <div className="text-center p-2.5 rounded-lg bg-muted/10 border border-white/5">
                                <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                                    + {liveMissions.length - 3} Sector Operations
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}