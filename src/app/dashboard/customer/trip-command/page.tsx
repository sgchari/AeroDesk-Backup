'use client';

import React from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useUser } from "@/firebase";
import type { TripCommand } from "@/lib/types";
import { 
    Plane, 
    Hotel, 
    Car, 
    Clock, 
    MapPin, 
    ArrowRight, 
    ShieldCheck, 
    Activity,
    CheckCircle2,
    Zap,
    Download
} from "lucide-react";
import { LiveTrackingMap } from '@/components/dashboard/charter/live-tracking-map';
import { Skeleton } from '@/components/ui/skeleton';

export default function TripCommandPage() {
    const { user } = useUser();
    const { data: trips, isLoading } = useCollection<TripCommand>(null, 'tripCommand');

    const activeTrip = trips?.[0]; // Get the priority active trip

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Travel Command" 
                description="Unified trip orchestration. Consolidated view of flight telemetry, hospitality, and ground logistics."
            />

            {isLoading ? <Skeleton className="h-[400px] w-full" /> : activeTrip ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* --- MISSION RADAR --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-card border-accent/20 overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-0 p-4 z-20">
                                <Badge className="bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest px-3 h-7 shadow-lg">
                                    <Activity className="h-3.5 w-3.5 mr-2 animate-pulse" />
                                    Live Mission Tracking
                                </Badge>
                            </div>
                            <div className="aspect-video relative">
                                <LiveTrackingMap origin={activeTrip.origin} destination={activeTrip.destination} />
                            </div>
                            <CardContent className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Mission Sector</p>
                                        <h3 className="text-xl font-bold text-white uppercase">{activeTrip.origin.split(' (')[0]} → {activeTrip.destination.split(' (')[0]}</h3>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase">ETA Terminal</p>
                                            <p className="text-sm font-black text-accent">14:42 IST</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase">Asset Type</p>
                                            <p className="text-sm font-black text-white">{activeTrip.aircraft}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* --- TRIP SEGMENTS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-white/[0.02] border-white/5 group hover:border-accent/20 transition-all">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Plane className="h-5 w-5 text-accent" />
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase">Aviation Segment</h4>
                                        <p className="text-[10px] text-muted-foreground font-code">REF: {activeTrip.charterBookingId}</p>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase text-accent group-hover:text-white transition-colors">
                                        View Manifest <ArrowRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/[0.02] border-white/5 group hover:border-rose-500/20 transition-all">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Hotel className="h-5 w-5 text-rose-400" />
                                        <Badge variant="outline" className="h-4 text-[8px] border-rose-500/30 text-rose-400">VOUCHER READY</Badge>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase">Hospitality Segment</h4>
                                        <p className="text-[10px] text-muted-foreground font-code">REF: {activeTrip.hotelBookingId}</p>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase text-rose-400 group-hover:text-white transition-colors">
                                        Get Voucher <Download className="h-3 w-3 ml-1" />
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/[0.02] border-white/5 group hover:border-blue-500/20 transition-all">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Car className="h-5 w-5 text-blue-400" />
                                        <Clock className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase">Ground Segment</h4>
                                        <p className="text-[10px] text-muted-foreground font-code">REF: {activeTrip.transportBookingId}</p>
                                    </div>
                                    <p className="text-[9px] text-blue-400/60 font-bold uppercase">Dispatching at 14:15</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* --- CONCIERGE SIDEBAR --- */}
                    <div className="space-y-6">
                        <Card className="bg-card shadow-2xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Mission Integrity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-bold uppercase">Departure Readiness</span>
                                        <span className="text-emerald-500 font-black">100% SECURE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-bold uppercase">DGCA Compliance</span>
                                        <span className="text-emerald-500 font-black">VERIFIED</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-muted-foreground font-bold uppercase">Slot Slotting</span>
                                        <span className="text-blue-400 font-black">CONFIRMED</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-accent text-accent-foreground font-black uppercase text-[10px] h-10 shadow-xl shadow-accent/10">
                                    Contact Dispatch Desk
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/10 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-xs font-black uppercase text-primary">Operational Advisory</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                    "Weather conditions at Delhi (VIDP) are currently optimal for the scheduled 10:00 AM departure. No air-traffic delays reported for the mission corridor."
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="text-center py-24 bg-card/20 border-2 border-dashed rounded-3xl opacity-50">
                    <Plane className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-sm text-muted-foreground uppercase font-black tracking-widest">No active Travel Command session identified</p>
                </div>
            )}
        </div>
    );
}
