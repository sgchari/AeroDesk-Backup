'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/firebase";
import type { AircraftAvailability } from "@/lib/types";
import { Clock, ShieldCheck, Zap, Users, Plane, ArrowRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function JetAvailabilityNetworkPage() {
    const { data: availability, isLoading } = useCollection<AircraftAvailability>(null, 'aircraftAvailability');

    const windows = [
        { key: '3hours', label: '0 – 3 Hours', color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'IMMEDIATE DISPATCH' },
        { key: '6hours', label: '3 – 6 Hours', color: 'text-sky-500', bg: 'bg-sky-500/10', sub: 'EARLY TURNAROUND' },
        { key: '12hours', label: '6 – 12 Hours', color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'NEXT CYCLE' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Jet Availability Network" 
                description="Real-time classification of ready-to-depart fleet assets based on positioning and operator duty cycles."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {windows.map(win => (
                    <Card key={win.key} className="bg-card group hover:border-white/10 transition-all">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-white">{win.label}</CardTitle>
                                    <p className={cn("text-[8px] font-black tracking-widest uppercase", win.color)}>{win.sub}</p>
                                </div>
                                <div className={cn("p-2 rounded-xl", win.bg)}>
                                    <Clock className={cn("h-4 w-4", win.color)} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {isLoading ? <Skeleton className="h-24 w-full" /> : (
                                availability?.filter(a => a.availabilityWindow === win.key).map(asset => (
                                    <div key={asset.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group/asset shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-white uppercase font-code group-hover/asset:text-accent transition-colors">{asset.registration}</p>
                                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">{asset.aircraftType}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] uppercase font-black text-muted-foreground mb-0.5">Hub Node</p>
                                                <Badge variant="outline" className="text-[9px] font-black border-accent/20 text-accent bg-accent/5 h-5 px-2">{asset.currentAirport}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                                                <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-accent" /> {asset.seats} PAX</span>
                                                <span className="uppercase tracking-tighter truncate max-w-[80px]">{asset.operator}</span>
                                            </div>
                                            <ArrowRight className="h-3.5 w-3.5 text-white/10 group-hover/asset:text-accent group-hover/asset:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                ))
                            )}
                            {(!isLoading && !availability?.some(a => a.availabilityWindow === win.key)) && (
                                <div className="py-12 text-center opacity-30">
                                    <Plane className="h-8 w-8 mx-auto text-muted-foreground/20 mb-3" />
                                    <p className="text-[10px] uppercase font-black tracking-widest">No assets identified</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="p-6 rounded-2xl bg-accent/5 border border-accent/20 flex items-start gap-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldCheck className="h-32 w-32 -mr-8 -mt-8" />
                </div>
                <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                <div className="space-y-1 relative z-10">
                    <h4 className="text-sm font-black uppercase text-accent tracking-widest">Availability Verification Protocol</h4>
                    <p className="text-xs text-white/70 leading-relaxed max-w-3xl">
                        Availability windows are calculated by cross-referencing real-time ADS-B positioning with NSOP operator flight duty time limitations (FDTL). Confirmation within the identified window is subject to terminal handling approval, technical dispatch clearance, and slot synchronization.
                    </p>
                </div>
            </div>
        </div>
    );
}
