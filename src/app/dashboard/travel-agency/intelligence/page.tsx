'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Zap, Globe, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const trends = [
    {
        type: 'DEMAND',
        title: 'BOM-GOI Sector Surge',
        description: 'Seat inquiries for Goa positioning flights have increased by 45% for the upcoming long weekend. Predictive modeling suggests yield optimization via tiered pricing.',
        impact: 'High',
        trend: 'up',
        color: 'text-accent'
    },
    {
        type: 'PROFITABILITY',
        title: 'Mid-size Jet Margin Gap',
        description: 'Agency commissions on mid-size jets are currently 12% higher than light jets due to seasonal operator incentives. Suggest shifting corporate focus.',
        impact: 'Medium',
        trend: 'up',
        color: 'text-sky-400'
    },
    {
        type: 'MARKET',
        title: 'New Corridor Opportunity',
        description: 'Consistent demand identified for Pune-Hyderabad sectors with no active empty leg inventory. High potential for direct charter lead generation.',
        impact: 'High',
        trend: 'up',
        color: 'text-emerald-500'
    }
];

export default function AgencyIntelligencePage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Market Intelligence" description="Pattern identification and opportunistic commercial signals." />
            
            <Card className="bg-primary/10 border-accent/20 overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/10 rounded-2xl">
                            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-accent">Commercial Intelligence Layer</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">PREDICTIVE ANALYTICS & YIELD GROWTH SIGNALS</p>
                        </div>
                        <Badge variant="outline" className="ml-auto bg-black/40 text-accent border-accent/30 font-code text-[10px] px-4 py-1">
                            MARKET MONITOR ACTIVE
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {trends.map((insight, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-accent/20 transition-all flex flex-col gap-4 group/item shadow-lg">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest border-white/10 px-2", insight.color)}>
                                        {insight.type}
                                    </Badge>
                                    <ArrowUpRight className="h-4 w-4 text-accent/40 group-hover/item:text-accent transition-colors" />
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
                                        <span className="text-[9px] font-code text-accent uppercase font-bold">Signal Live</span>
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
                            Profitable Sector Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { route: 'Mumbai → Dubai', yield: 'High', conversion: '82%' },
                            { route: 'Delhi → London', yield: 'Critical', conversion: '65%' },
                            { route: 'Bengaluru → Singapore', yield: 'Medium', conversion: '74%' }
                        ].map((sector, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{sector.route}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-emerald-500">{sector.yield} Yield</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{sector.conversion} Conv.</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4 text-sky-400" />
                            Client Demand Hotspots
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { region: 'West Zone (BOM)', volume: '+32%', status: 'Surging' },
                            { region: 'North Zone (DEL)', volume: '+18%', status: 'Optimal' },
                            { region: 'South Zone (BLR)', volume: '+25%', status: 'High' }
                        ].map((hotspot, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{hotspot.region}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-sky-400">{hotspot.volume}</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{hotspot.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
