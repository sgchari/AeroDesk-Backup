'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Zap, Plane, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const routeInsights = [
    {
        type: 'YIELD',
        title: 'Repositioning Opportunity: BOM-GOI',
        description: 'Empty leg conversion for this corridor is currently 2.4x above national average. Suggest scheduling maintenance windows around these positioning legs.',
        impact: 'Critical',
        trend: 'up',
        color: 'text-rose-500'
    },
    {
        type: 'CAPACITY',
        title: 'Heavy Jet Shortage: North Zone',
        description: 'Detected 8 unfulfilled Heavy Jet requests from Delhi in the last 24h. Repositioning VT-STK to VIDP could capture ₹ 1.2 Cr in immediate yield.',
        impact: 'High',
        trend: 'up',
        color: 'text-accent'
    },
    {
        type: 'EFFICIENCY',
        title: 'Fuel Optimization Signal',
        description: 'Cluster of 4 missions identified for Singapore sector. Consolidating positioning via Middle-East hubs can reduce operational cost by 15%.',
        impact: 'Medium',
        trend: 'down',
        color: 'text-sky-400'
    }
];

export default function OperatorIntelligencePage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Route Intelligence" description="Fleet-wide optimization signals and predictive demand analysis." />
            
            <Card className="bg-primary/10 border-accent/20 overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/10 rounded-2xl">
                            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-accent">Flight Operations Intelligence</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">PREDICTIVE FLEET POSITIONING & YIELD ANOMALIES</p>
                        </div>
                        <Badge variant="outline" className="ml-auto bg-black/40 text-accent border-accent/30 font-code text-[10px] px-4 py-1">
                            NETWORK RADAR ACTIVE
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {routeInsights.map((insight, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-accent/20 transition-all flex flex-col gap-4 group/item shadow-lg">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest border-white/10 px-2", insight.color)}>
                                        {insight.type}
                                    </Badge>
                                    <ArrowUpRight className="h-4 w-4 text-accent/40" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-white group-hover/item:text-accent transition-colors">
                                        {insight.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        "{insight.description}"
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Impact: {insight.impact}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                        <span className="text-[9px] font-code text-accent uppercase font-bold">Live Data</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="h-4 w-4 text-accent" />
                            High Demand Corridor Index
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { route: 'Delhi → Dubai', demand: 'Critical', yield: '+22%' },
                            { route: 'Mumbai → London', demand: 'High', yield: '+18%' },
                            { route: 'Bangalore → Hyderabad', demand: 'Optimal', yield: '+12%' }
                        ].map((sector, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{sector.route}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-emerald-500">{sector.yield} Yield</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{sector.demand}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Plane className="h-4 w-4 text-sky-400" />
                            Asset Allocation Signals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { asset: 'Heavy Jet Fleet', action: 'Reposition VIDP', status: 'Priority' },
                            { asset: 'Light Jet Fleet', action: 'Increase BOM Block', status: 'Optimal' },
                            { asset: 'Mid-size Fleet', action: 'Standby for BLR', status: 'Advisory' }
                        ].map((signal, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{signal.asset}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-sky-400">{signal.action}</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{signal.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
