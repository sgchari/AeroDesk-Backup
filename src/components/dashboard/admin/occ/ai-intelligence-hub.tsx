'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/firebase";
import type { RouteDemandHistory, EmptyLegPrediction, FleetOptimizationSuggestion } from "@/lib/types";
import { Sparkles, TrendingUp, Target, Zap, ArrowUpRight, ShieldCheck, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function AIIntelligenceHub() {
    const { data: demandHistory } = useCollection<RouteDemandHistory>(null, 'routeDemandHistory');
    const { data: predictions } = useCollection<EmptyLegPrediction>(null, 'emptyLegPredictions');
    const { data: suggestions } = useCollection<FleetOptimizationSuggestion>(null, 'fleetOptimizationSuggestions');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Route Profitability & Demand */}
            <Card className="lg:col-span-2 bg-card border-accent/20">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Route Profitability Analysis
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase">GTV and Demand Score correlation by sector.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent font-code text-[9px]">WAREHOUSE SYNC: ACTIVE</Badge>
                    </div>
                </CardHeader>
                <CardContent className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={demandHistory || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="route" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                            <Bar dataKey="demandScore" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Demand Index" />
                            <Bar dataKey="monthlyFlightCount" fill="#1B263B" radius={[4, 4, 0, 0]} name="Volume" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Empty Leg Prediction Monitor */}
            <Card className="bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Empty Leg Prediction
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase">Repositioning detection probability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {predictions?.map(pred => (
                        <div key={pred.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-white uppercase">{pred.predictedRoute}</span>
                                <Badge className="bg-blue-500/20 text-blue-400 border-none h-4 text-[8px] font-black">{Math.round(pred.probability * 100)}% PROB</Badge>
                            </div>
                            <p className="text-[9px] text-muted-foreground italic leading-tight">"{pred.reason}"</p>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-tighter">{pred.aircraft}</span>
                                <span className="text-[8px] text-accent uppercase font-black">{pred.timeframe} WINDOW</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Fleet Optimization Panel */}
            <Card className="lg:col-span-3 bg-primary/10 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-white">
                        <Target className="h-5 w-5 text-primary animate-pulse" />
                        AI Fleet Optimization Recommendations
                    </CardTitle>
                    <CardDescription className="text-xs">Predictive asset allocation to capture emerging regional demand clusters.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions?.map(fos => (
                            <div key={fos.id} className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-3 group shadow-xl">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-[9px] uppercase font-black border-primary/20 text-primary">{fos.operator}</Badge>
                                    <div className="flex items-center gap-2">
                                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-black text-emerald-500">+{fos.expectedYieldIncrease}% YIELD</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{fos.recommendation}</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">"{fos.reason}"</p>
                                </div>
                                <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-[9px] uppercase font-black text-muted-foreground">{fos.aircraft}</span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/10">Publish Advisory</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
