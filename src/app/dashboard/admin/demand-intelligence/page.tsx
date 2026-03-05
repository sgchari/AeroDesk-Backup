'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection } from "@/firebase";
import type { CharterDemandForecast } from "@/lib/types";
import { Target, TrendingUp, Sparkles, MapPin, Plane, ArrowUpRight, Zap, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const MOCK_HISTORICAL = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 52 },
    { day: 'Wed', score: 48 },
    { day: 'Thu', score: 61 },
    { day: 'Fri', score: 85 },
    { day: 'Sat', score: 92 },
    { day: 'Sun', score: 70 },
];

export default function DemandIntelligencePage() {
    const { data: forecasts, isLoading } = useCollection<CharterDemandForecast>(null, 'charterDemandForecast');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Demand Intelligence Engine" 
                description="AI-driven predictive modeling for national charter corridors. Identifying seasonal clusters and capacity pressure."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- SECTOR FORECAST SECTOR --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-primary/10 border-accent/20 overflow-hidden relative group shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-accent/10 rounded-2xl">
                                    <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-[0.2em] text-accent">Predictive Demand Grid</h3>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">7-DAY PROBABILISTIC SECTOR LOAD</p>
                                </div>
                                <Badge variant="outline" className="ml-auto bg-black/40 text-accent border-accent/30 font-code text-[10px] px-4 py-1">
                                    ENGINE ACTIVE
                                </Badge>
                            </div>

                            <div className="grid gap-4">
                                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                                    forecasts?.map((forecast) => (
                                        <div key={forecast.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-accent/20 transition-all flex items-center justify-between group shadow-lg">
                                            <div className="flex items-center gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sector Index</p>
                                                    <p className="text-base font-bold text-white uppercase">{forecast.origin} » {forecast.destination}</p>
                                                </div>
                                                <div className="h-10 w-px bg-white/5 hidden md:block" />
                                                <div className="hidden md:block space-y-1">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asset Match</p>
                                                    <div className="flex gap-2">
                                                        {forecast.aircraftTypeDemand.map(type => (
                                                            <Badge key={type} variant="outline" className="text-[8px] uppercase border-white/10 text-white/60">{type}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] font-black text-accent uppercase tracking-widest">Demand Score</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-black text-white">{forecast.predictedDemandScore}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Historical Demand Flux
                            </CardTitle>
                            <CardDescription>7-day rolling average of platform request signals.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_HISTORICAL}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#D4AF37" fillOpacity={1} fill="url(#colorScore)" name="Demand Flux" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* --- INTELLIGENCE ASIDE --- */}
                <div className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Target className="h-4 w-4 text-accent" />
                                Hotspot Hub Discovery
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { city: 'Mumbai (VABB)', pressure: 'CRITICAL', growth: '+22%' },
                                { city: 'Delhi (VIDP)', pressure: 'HIGH', growth: '+15%' },
                                { city: 'Bangalore (VOBL)', pressure: 'OPTIMAL', growth: '+8%' },
                                { city: 'Goa (VOGO)', pressure: 'SURGING', growth: '+45%' },
                            ].map(hub => (
                                <div key={hub.city} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-white">{hub.city}</p>
                                        <p className="text-[8px] font-black uppercase text-accent">{hub.pressure}</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-500">{hub.growth}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-sky-400" />
                                Capacity Advisory
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                "High demand cluster identified for heavy-jet missions on Middle-East corridors. Recommend prioritizing operator blocks for Dubai sectors to optimize yield."
                            </p>
                            <div className="pt-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[9px] font-black uppercase text-muted-foreground">Fleet Saturation</span>
                                    <span className="text-[9px] font-black text-sky-400">84%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-sky-400 w-[84%]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
