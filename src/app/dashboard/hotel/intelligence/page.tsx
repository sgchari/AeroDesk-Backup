'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Zap, Hotel, BedDouble, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

const marketInsights = [
    {
        type: 'DEMAND',
        title: 'Cluster Arrival Alert: West Zone',
        description: 'Cluster of 6 heavy jet missions identified for Mumbai arrivals between Aug 15-18. Presidential and Executive suite demand will exceed current platform blocks.',
        impact: 'High',
        trend: 'up',
        color: 'text-rose-500'
    },
    {
        type: 'YIELD',
        title: 'Corporate Stay pattern shift',
        description: 'Corporate travel desks are increasing stay duration from 1.2 to 2.8 nights for R&D missions. Opportunity for multi-day executive packages.',
        impact: 'Medium',
        trend: 'up',
        color: 'text-sky-400'
    },
    {
        type: 'OPTIMIZATION',
        title: 'Dynamic Rate Signal',
        description: 'Historical data identifies 15% yield growth feasibility for Deluxe King rooms during mid-week charter peaks. Suggest adjusting network-direct rates.',
        impact: 'High',
        trend: 'up',
        color: 'text-accent'
    }
];

export default function HotelIntelligencePage() {
    const { user } = useUser();

    return (
        <div className="space-y-6">
            <PageHeader title="Property Intelligence" description="Anticipate arrivals and optimize yield through charter network signals." />
            
            <Card className="bg-primary/10 border-emerald-500/20 overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl">
                            <Sparkles className="h-6 w-6 text-emerald-500 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-emerald-500">Hospitality Network Intelligence</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">REAL-TIME ARRIVAL FORECASTING & YIELD ANOMALIES</p>
                        </div>
                        <Badge variant="outline" className="ml-auto bg-black/40 text-emerald-500 border-emerald-500/30 font-code text-[10px] px-4 py-1">
                            ARRIVAL RADAR ACTIVE
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {marketInsights.map((insight, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col gap-4 group/item shadow-lg">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest border-white/10 px-2", insight.color)}>
                                        {insight.type}
                                    </Badge>
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500/40" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-white group-hover/item:text-emerald-500 transition-colors">
                                        {insight.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        "{insight.description}"
                                    </p>
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">Impact: {insight.impact}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                        <span className="text-[9px] font-code text-emerald-500 uppercase font-bold">Live Link</span>
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
                            Seasonal Occupancy Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { event: 'Corporate Summit Cluster', arrivals: '12 missions', status: 'High Demand' },
                            { event: 'Weekend Beach positioning', arrivals: '8 missions', status: 'Optimal' },
                            { event: 'Direct Client Peak', arrivals: '15 missions', status: 'Critical' }
                        ].map((sector, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{sector.event}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-emerald-500">{sector.arrivals}</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{sector.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BedDouble className="h-4 w-4 text-sky-400" />
                            Inventory Blocking Signals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { category: 'Presidential Suites', signal: 'Block 2 Units', status: 'Priority' },
                            { category: 'Executive Floor', signal: 'Optimal Flow', status: 'Normal' },
                            { category: 'Boutique Collection', signal: 'Increase Availability', status: 'Low Flow' }
                        ].map((signal, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{signal.category}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-sky-400">{signal.signal}</span>
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
