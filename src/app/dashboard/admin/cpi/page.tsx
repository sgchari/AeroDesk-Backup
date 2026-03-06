'use client';

import React from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { useCollection } from "@/firebase";
import type { CharterPriceIndex } from "@/lib/types";
import { TrendingUp, Target, Coins, Zap, MapPin, Activity, History } from "lucide-react";
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    BarChart,
    Bar
} from 'recharts';

const MOCK_HISTORICAL = [
    { day: 'Mon', index: 0.85 },
    { day: 'Tue', index: 0.88 },
    { day: 'Wed', index: 0.92 },
    { day: 'Thu', index: 0.95 },
    { day: 'Fri', index: 1.02 },
    { day: 'Sat', index: 1.15 },
    { day: 'Sun', index: 0.98 },
];

export default function CPIAnalyticsPage() {
    const { data: cpiData } = useCollection<CharterPriceIndex>(null, 'charterPriceIndex');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Charter Price Index (CPI)" 
                description="Aggregated pricing intelligence derived from confirmed missions, quotes, and seat allocations."
            />

            <StatsGrid>
                <StatsCard title="Market Index Avg" value="₹ 7.2 L" icon={Coins} description="Core Metropolitan Mean" trend={{ value: '+4.2%', positive: false }} />
                <StatsCard title="Demand Pressure" value="0.92" icon={Target} description="Platform-wide signal" trend={{ value: '+12%', positive: true }} />
                <StatsCard title="Inventory Yield" value="₹ 45 K" icon={Zap} description="Avg Empty Leg Recovery" />
                <StatsCard title="Active Sectors" value="42" icon={MapPin} description="Live price monitoring" />
            </StatsGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-card border-accent/20">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="h-4 w-4 text-accent" />
                                Demand Intensity vs. Index Flux
                            </CardTitle>
                            <CardDescription>7-day rolling average of platform pricing sensitivity.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent font-code text-[10px]">REAL-TIME SYNC</Badge>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HISTORICAL}>
                                <defs>
                                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="index" stroke="#D4AF37" fillOpacity={1} fill="url(#colorIndex)" name="CPI Signal" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" /> Sector Yield Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cpiData?.map(item => (
                                <div key={item.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-white uppercase">{item.route}</span>
                                        <Badge variant="outline" className={cn(
                                            "text-[8px] font-black h-4 px-1.5",
                                            item.priceChangePercent > 0 ? "border-rose-500/30 text-rose-500" : "border-emerald-500/30 text-emerald-500"
                                        )}>
                                            {item.priceChangePercent > 0 ? '+' : ''}{item.priceChangePercent}%
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-muted-foreground uppercase">{item.aircraftCategory}</span>
                                        <span className="text-xs font-black text-accent">₹ {(item.averagePrice / 100000).toFixed(1)} L</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-black/20 border-white/5">
                        <CardContent className="p-6">
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                "Institutional pricing indexes are generated hourly. Significant upward pressure detected on West Zone corridors due to seasonal demand clusters."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
