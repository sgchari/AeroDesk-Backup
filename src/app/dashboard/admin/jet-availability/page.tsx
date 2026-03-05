'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/firebase";
import type { AircraftAvailability } from "@/lib/types";
import { Clock, MapPin, ShieldCheck, Zap, Users, Plane, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function JetAvailabilityNetworkPage() {
    const { data: availability, isLoading } = useCollection<AircraftAvailability>(null, 'aircraftAvailability');

    const windows = [
        { key: '3hours', label: '0 – 3 Hours', color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { key: '6hours', label: '3 – 6 Hours', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { key: '12hours', label: '6 – 12 Hours', color: 'text-sky-500', bg: 'bg-sky-500/10' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Jet Availability Network" 
                description="Real-time classification of ready-to-depart fleet assets based on positioning and operator duty cycles."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {windows.map(win => (
                    <Card key={win.key} className="bg-card">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-white">{win.label}</CardTitle>
                                <div className={cn("p-1.5 rounded-lg", win.bg)}>
                                    <Clock className={cn("h-4 w-4", win.color)} />
                                </div>
                            </div>
                            <CardDescription className="text-[10px] uppercase font-bold">Time-critical dispatch capacity</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {isLoading ? <Skeleton className="h-24 w-full" /> : (
                                availability?.filter(a => a.availabilityWindow === win.key).map(asset => (
                                    <div key={asset.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-white uppercase font-code">{asset.registration}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase">{asset.aircraftType}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] uppercase font-black text-muted-foreground">Hub Node</p>
                                                <p className="text-[10px] font-bold text-accent uppercase">{asset.currentAirport}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {asset.seats} PAX</span>
                                                <span className="flex items-center gap-1 uppercase tracking-tighter">{asset.operator}</span>
                                            </div>
                                            <ArrowRight className="h-3 w-3 text-white/20 group-hover:text-accent transition-colors" />
                                        </div>
                                    </div>
                                ))
                            )}
                            {(!isLoading && !availability?.some(a => a.availabilityWindow === win.key)) && (
                                <div className="py-10 text-center opacity-40">
                                    <Plane className="h-8 w-8 mx-auto text-muted-foreground/20 mb-2" />
                                    <p className="text-[9px] uppercase font-black">No assets identified</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-start gap-4 shadow-2xl">
                <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase text-accent tracking-widest">Network Verification Protocol</h4>
                    <p className="text-xs text-white/70 leading-relaxed max-w-3xl">
                        Availability windows are calculated by cross-referencing real-time ADS-B positioning with NSOP operator flight duty time limitations (FDTL). Confirmation within the identified window is subject to terminal handling approval and technical dispatch.
                    </p>
                </div>
            </div>
        </div>
    );
}
