'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, TrendingUp, ShieldCheck, Target, Zap, Globe, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/shared/page-header";

const insights = [
    {
        type: 'DEMAND',
        title: 'BOM-DEL Corridor Surge',
        description: 'Charter inquiries for Mumbai-Delhi sectors have increased by 32% this week. Predictive modeling suggests capacity pressure for heavy jets during the upcoming weekend.',
        impact: 'Critical',
        trend: 'up',
        color: 'text-rose-500'
    },
    {
        type: 'NETWORK',
        title: 'Empty Leg Optimization Gap',
        description: 'Detected 12 repositioning flights in the South Zone without seat inventory listings. Potential unrecovered yield estimated at ₹ 1.2 Cr.',
        impact: 'High',
        trend: 'up',
        color: 'text-accent'
    },
    {
        type: 'COMPLIANCE',
        title: 'GST Validation Pattern',
        description: 'New operator onboarding conversion is currently bottlenecked at the GST verification stage. Avg validation latency is now 4.2 hours.',
        impact: 'Medium',
        trend: 'down',
        color: 'text-sky-400'
    }
];

export function AdminIntelligence() {
    return (
        <div className="space-y-6">
            <PageHeader title="Global Intelligence Layer" description="Cross-stakeholder pattern identification and market dynamics." />
            
            <Card className="bg-primary/10 border-accent/20 overflow-hidden relative group shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-accent/10 rounded-2xl">
                            <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-[0.2em] text-accent">National Aviation Intelligence</h3>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">REAL-TIME ANOMALY DETECTION & PREDICTIVE FORECASTING</p>
                        </div>
                        <Badge variant="outline" className="ml-auto bg-black/40 text-accent border-accent/30 font-code text-[10px] px-4 py-1">
                            NETWORK GUARD ACTIVE
                        </Badge>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-accent/20 transition-all flex flex-col gap-4 group/item shadow-lg">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-widest border-white/10 px-2", insight.color)}>
                                        {insight.type}
                                    </Badge>
                                    <TrendingUp className="h-4 w-4 text-accent/40" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-foreground group-hover/item:text-accent transition-colors">
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
                                        <span className="text-[9px] font-code text-accent uppercase font-bold">Live Link</span>
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
                            Operator Performance Matrix
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: 'FlyCo Charter', score: 98, status: 'Top Rated' },
                            { name: 'Taj Air', score: 95, status: 'Reliable' },
                            { name: 'Club One Air', score: 92, status: 'Optimal' }
                        ].map((op, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-white">{op.name}</span>
                                    <Badge className="bg-accent/10 text-accent border-none text-[8px] h-4">{op.status}</Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-accent">{op.score}%</p>
                                    <div className="w-20 h-1 bg-white/5 rounded-full mt-1">
                                        <div className="h-full bg-accent" style={{ width: `${op.score}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="h-4 w-4 text-sky-400" />
                            Sector Yield Forecast
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { route: 'Mumbai → London', yield: '+18%', pressure: 'High' },
                            { route: 'Delhi → Dubai', yield: '+12%', pressure: 'Medium' },
                            { route: 'Bangalore → Singapore', yield: '+25%', pressure: 'Critical' }
                        ].map((route, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-xs font-bold text-white">{route.route}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-emerald-500">{route.yield}</span>
                                    <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10">{route.pressure}</Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}