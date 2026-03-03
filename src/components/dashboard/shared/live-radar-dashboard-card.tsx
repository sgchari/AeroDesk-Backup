
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LiveTrackingMap } from '@/components/dashboard/charter/live-tracking-map';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Plane } from 'lucide-react';
import Link from 'next/link';
import { CharterRFQ } from '@/lib/types';

export function LiveRadarDashboardCard({ missions }: { missions: CharterRFQ[] }) {
    if (!missions || !missions.length) return null;

    // Filter for truly enroute/live statuses
    const liveMissions = missions.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status));
    
    if (!liveMissions.length) return null;

    return (
        <Card className="bg-card border-accent/20 overflow-hidden relative group animate-in fade-in slide-in-from-top-4 duration-1000 mb-6">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-accent/10 rounded-lg">
                            <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-accent">Active Mission Radar</CardTitle>
                            <CardDescription className="text-[10px] text-muted-foreground uppercase">Real-time situational awareness across the network</CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="font-code text-[10px] text-accent border-accent/20 bg-accent/5">
                        {liveMissions.length} MISSION{liveMissions.length > 1 ? 'S' : ''} ACTIVE
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LiveTrackingMap 
                            origin={liveMissions[0].departure} 
                            destination={liveMissions[0].arrival} 
                        />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Telemetry Feed</h4>
                        {liveMissions.slice(0, 3).map(mission => (
                            <Link key={mission.id} href={`/dashboard/charter/${mission.id}`} className="block">
                                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group/item">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[9px] font-black text-muted-foreground uppercase font-code group-hover/item:text-accent">{mission.id}</p>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none h-4 text-[8px] font-black uppercase tracking-tighter px-1.5">
                                            {mission.status === 'arrived' ? 'TOUCHDOWN' : 'EN ROUTE'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                                        <Plane className="h-3 w-3 text-accent/60" />
                                        <span>{mission.departure.split(' (')[0]} → {mission.arrival.split(' (')[0]}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                        <p className="text-[8px] text-muted-foreground uppercase font-bold truncate max-w-[120px]">{mission.customerName}</p>
                                        <p className="text-[9px] text-accent flex items-center gap-1 font-bold uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            View <ArrowRight className="h-2.5 w-2.5" />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {liveMissions.length > 3 && (
                            <div className="text-center p-2 rounded bg-muted/10 border border-white/5">
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                                    + {liveMissions.length - 3} Additional Flights En Route
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
