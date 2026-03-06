'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCollection, useUser } from "@/firebase";
import type { Aircraft, FleetOptimizationSuggestion } from "@/lib/types";
import { Activity, Plane, Clock, Target, TrendingUp, AlertCircle, ShieldCheck, Zap, Sparkles, ArrowUpRight } from "lucide-react";
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
    LineChart,
    Line
} from 'recharts';
import { useMemo } from "react";

const COLORS = ['#0EA5E9', '#D4AF37', '#10B981', '#F43F5E'];

const MOCK_UTIL_HISTORY = [
    { week: 'W1', util: 62 },
    { week: 'W2', util: 68 },
    { week: 'W3', util: 74 },
    { week: 'W4', util: 71 },
    { week: 'W5', util: 82 },
];

export default function FleetIntelligencePage() {
    const { user } = useUser();
    
    // Use operatorId for context
    const effectiveId = user?.operatorId || user?.id;

    const { data: fleet, isLoading: fleetLoading } = useCollection<Aircraft>(null, effectiveId ? `operators/${effectiveId}/aircrafts` : undefined);
    const { data: suggestions, isLoading: suggestionsLoading } = useCollection<FleetOptimizationSuggestion>(null, 'fleetOptimizationSuggestions');

    const stats = useMemo(() => {
        if (!fleet) return { avgUtil: 0, totalHours: 0, aogCount: 0 };
        return {
            avgUtil: 72, // Mock average
            totalHours: fleet.length * 142,
            aogCount: fleet.filter(a => a.status === 'AOG').length
        };
    }, [fleet]);

    const chartData = useMemo(() => {
        return fleet?.map(a => ({
            name: a.registration,
            hours: 120 + Math.random() * 50,
            util: 60 + Math.random() * 30
        })) || [];
    }, [fleet]);

    const isLoading = fleetLoading || suggestionsLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Fleet Utilization Intelligence" 
                description={`Operational efficiency and mission-level analytics for ${user?.company || 'Your Fleet'}.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-card border-white/5 border-l-4 border-l-primary shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Fleet Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">{stats.avgUtil}%</div>
                        <p className="text-[9px] text-emerald-500 font-bold uppercase mt-1 tracking-tighter">Optimal Performance</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-white/5 border-l-4 border-l-primary shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Air-time (MTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">{stats.totalHours} hrs</div>
                        <p className="text-[9px] text-sky-500 font-bold uppercase mt-1 tracking-tighter">Logged Fleet Hours</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-white/5 border-l-4 border-l-rose-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">AOG Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">{stats.aogCount}</div>
                        <p className="text-[9px] text-rose-500 font-bold uppercase mt-1 tracking-tighter">Attention Required</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-white/5 border-l-4 border-l-accent shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Revenue Intensity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-accent">₹ 4.2 Cr</div>
                        <p className="text-[9px] text-accent/60 font-bold uppercase mt-1 tracking-tighter">Platform GSV</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Optimization Suggestions (NEW) */}
            <Card className="bg-primary/10 border-accent/20 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-white font-bold">
                        <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                        AI Fleet Optimization Suggestions
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-tighter">Predictive modeling identifying repositioning opportunities to capture surging demand clusters.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions?.filter(s => s.operator === (user?.company || 'FlyCo Charter')).map(fos => (
                            <div key={fos.id} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-accent/30 transition-all group shadow-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">{fos.aircraft}</span>
                                    <div className="flex items-center gap-2">
                                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">+{fos.expectedYieldIncrease}% YIELD TARGET</span>
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{fos.recommendation}</h4>
                                <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{fos.reason}"</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-card border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2 font-bold">
                            <Plane className="h-4 w-4 text-accent" />
                            Asset Level Utilization
                        </CardTitle>
                        <CardDescription>Individual aircraft flying percentage against monthly targets.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        {isLoading ? <Skeleton className="h-full w-full" /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="util" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-card border-white/5 shadow-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2 font-bold">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Fleet Health Pattern
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[200px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={MOCK_UTIL_HISTORY}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Line type="monotone" dataKey="util" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 shadow-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Maintenance Signal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">VT-PC (King Air)</span>
                                <Badge variant="outline" className="text-[8px] font-black text-amber-500 border-amber-500/30 bg-amber-500/5 px-2">DUE 12 DAYS</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                "Predictive audit identifies potential hydraulic pressure lag in VT-FLY. Recommend inspection at next Mumbai hub turnaround."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}