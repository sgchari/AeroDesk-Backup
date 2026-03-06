'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Activity, 
    Sparkles, 
    TrendingUp, 
    Target, 
    Zap, 
    ArrowUpRight, 
    ShieldCheck, 
    Clock, 
    MapPin,
    AlertCircle,
    Coins
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { cn } from "@/lib/utils";
import type { 
    FleetUtilization, 
    CharterDemandAnalytics, 
    EmptyLegOpportunity, 
    AircraftPositioningInsight, 
    CharterPriceBenchmark, 
    RevenueForecast 
} from "@/lib/types";

const COLORS = ['#0EA5E9', '#D4AF37', '#10B981', '#F43F5E'];

export default function OperatorIntelligencePage() {
    const { user } = useUser();
    
    const { data: utilization, isLoading: utilLoading } = useCollection<FleetUtilization>(null, 'fleetUtilization');
    const { data: demand, isLoading: demandLoading } = useCollection<CharterDemandAnalytics>(null, 'charterDemandAnalytics');
    const { data: opportunities, isLoading: oppLoading } = useCollection<EmptyLegOpportunity>(null, 'emptyLegOpportunities');
    const { data: insights, isLoading: insightLoading } = useCollection<AircraftPositioningInsight>(null, 'aircraftPositioningInsights');
    const { data: benchmarks } = useCollection<CharterPriceBenchmark>(null, 'charterPriceBenchmark');
    const { data: forecasts } = useCollection<RevenueForecast>(null, 'revenueForecast');

    const isLoading = utilLoading || demandLoading || oppLoading || insightLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Operator Intelligence Hub" 
                description={`Predictive revenue optimization and operational insights for ${user?.company || 'Your Fleet'}.`}
            />

            {/* SECTION 1: Fleet Utilization Overview */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-accent" />
                                    Fleet Utilization Performance
                                </CardTitle>
                                <CardDescription>Operational flying percentage vs. idle time (Last 30 Days).</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-black border-accent/20 text-accent bg-accent/5 uppercase">Real-time Pulse</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-64 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Utilization %</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Flight Hours</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Idle Hours</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {utilization?.map((unit) => (
                                        <TableRow key={unit.id} className="border-white/5 group hover:bg-white/[0.02]">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-xs">{unit.registration}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{unit.aircraftType}</div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={cn(
                                                        "text-xs font-black",
                                                        unit.utilizationPercentage < 50 ? "text-rose-500" : "text-white"
                                                    )}>
                                                        {unit.utilizationPercentage}%
                                                    </span>
                                                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn("h-full", unit.utilizationPercentage < 50 ? "bg-rose-500" : "bg-accent")} 
                                                            style={{ width: `${unit.utilizationPercentage}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-xs">{unit.totalFlightHours}h</TableCell>
                                            <TableCell className="text-center font-medium text-xs text-muted-foreground">{unit.idleHours}h</TableCell>
                                            <TableCell className="text-right">
                                                {unit.utilizationPercentage < 50 ? (
                                                    <Badge variant="destructive" className="bg-rose-500/10 text-rose-500 border-none h-5 text-[8px] font-black uppercase">Under-utilized</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="h-5 text-[8px] font-black uppercase border-white/10 text-muted-foreground">Optimal</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                            AI Optimization Logic
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3">
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                "Predictive audit identifies a 15% yield growth potential for VT-FLY by shifting maintenance windows to mid-week low demand cycles."
                            </p>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                                <span className="text-[9px] font-black text-accent uppercase tracking-widest">Protocol Verified</span>
                            </div>
                        </div>
                        <Separator className="border-white/5" />
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">System Signal</p>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5">
                                <span className="text-[10px] text-white">Market Latency</span>
                                <span className="text-[10px] font-bold text-emerald-500">1.4h (Optimal)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* SECTION 2: Charter Demand & Empty Leg Opportunities */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            High Intensity Charter Corridors
                        </CardTitle>
                        <CardDescription>Top demand routes across the AeroDesk network (30-day window).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? <Skeleton className="h-full w-full" /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={demand || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="route" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Bar dataKey="demandScore" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Demand Index" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Empty Leg Opportunity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            {opportunities?.map((opp) => (
                                <div key={opp.id} className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 group hover:border-primary/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-primary uppercase">{opp.registration}</p>
                                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none h-4 text-[8px] font-black uppercase">High Prob</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">{opp.currentCity}</span>
                                        <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm font-bold text-white">Delhi</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase text-muted-foreground font-black">Est. Seat Yield</p>
                                            <p className="text-xs font-black text-accent">₹ {(opp.potentialSeatRevenue / 100000).toFixed(1)} L</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/10">Publish Seats</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SECTION 3: Forecast & Positioning */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-accent" />
                            Positioning Advisory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {insights?.map((insight) => (
                            <div key={insight.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase">{insight.registration}</span>
                                    <Badge variant="outline" className="border-accent/30 text-accent text-[8px] font-black uppercase">Recommendation</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white">Target Base: {insight.recommendedBase}</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">"{insight.reason}"</p>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-accent uppercase tracking-tighter">
                                        <TrendingUp className="h-3 w-3" /> Demand Score: {insight.demandScore}
                                    </div>
                                    <Button variant="link" className="p-0 h-auto text-[9px] font-black uppercase text-accent group">
                                        Dispatch Order <ArrowUpRight className="h-2.5 w-2.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Coins className="h-4 w-4 text-primary" />
                            Revenue Forecast
                        </CardTitle>
                        <CardDescription>7-Day market opportunity window.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {forecasts?.slice(0, 2).map((f) => (
                            <div key={f.id} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{f.route}</p>
                                    <span className="text-xs font-black text-white">₹ {(f.estimatedRevenueOpportunity / 100000).toFixed(1)} L</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '75%' }} />
                                </div>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold">Projected Inquiries: {f.projectedDemandNext7Days}</p>
                            </div>
                        ))}
                        <div className="pt-4 border-t border-white/5">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-accent uppercase tracking-widest">Aggregate Forecast</p>
                                    <p className="text-xl font-black text-white">₹ 9.8 Cr</p>
                                </div>
                                <div className="p-2 bg-accent/10 rounded-full">
                                    <Zap className="h-5 w-5 text-accent animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            Market Benchmarks
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-xl bg-muted/10 border border-white/5 space-y-4">
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                Advisory pricing ranges based on confirmed platform missions and technical bids.
                            </p>
                            {benchmarks?.map(b => (
                                <div key={b.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white uppercase">{b.route}</span>
                                        <span className="text-[9px] text-muted-foreground uppercase">{b.aircraftCategory}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-black/40 text-[10px] font-black text-accent">
                                        <span>₹ {(b.minPrice / 100000).toFixed(1)}L</span>
                                        <span className="text-white/20">|</span>
                                        <span className="text-white">Avg: ₹ {(b.avgPrice / 100000).toFixed(1)}L</span>
                                        <span className="text-white/20">|</span>
                                        <span>₹ {(b.maxPrice / 100000).toFixed(1)}L</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-start gap-2 text-[9px] text-muted-foreground/60 leading-relaxed italic mt-2">
                            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                            <p>Operators maintain absolute control over pricing. Benchmark data is purely for market alignment guidance.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
