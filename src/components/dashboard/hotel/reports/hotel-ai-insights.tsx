'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Info, Target, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const insights = [
    {
        type: 'DEMAND',
        title: 'Suite Conversion Surge',
        description: 'Suite bookings for Mumbai properties rising by 22% during weekend charter arrivals. Suggest increasing inventory blocks for high-pax missions.',
        impact: 'High',
        trend: 'up',
        color: 'text-sky-400'
    },
    {
        type: 'PERFORMANCE',
        title: 'Response Time Alert',
        description: 'Lead response times for Presidential category requests have slowed by 15%. This is currently impacting conversion ratio for HNWIs.',
        impact: 'Critical',
        trend: 'down',
        color: 'text-rose-500'
    },
    {
        type: 'MARKET',
        title: 'Corporate Growth Signal',
        description: 'Corporate Travel Desk demand for long-duration stays (3+ nights) is increasing in the West Zone. Optimization signal for executive packages.',
        impact: 'High',
        trend: 'up',
        color: 'text-green-500'
    }
];

export function HotelAIInsights() {
    return (
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group">
            {/* Decorative Sparkle Glow */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Hospitality Intelligence Layer</h3>
                        <p className="text-[10px] text-muted-foreground font-bold">CHARTER-LINKED DEMAND FORECASTING & YIELD ANOMALIES</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-black/20 text-primary border-primary/20 font-code text-[10px]">
                        NETWORK SYNC ACTIVE
                    </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {insights.map((insight, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3 group/item">
                            <div className="flex items-center justify-between">
                                <Badge variant="outline" className={cn("text-[8px] uppercase font-bold tracking-widest border-white/10", insight.color)}>
                                    {insight.type}
                                </Badge>
                                {insight.trend === 'up' ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 text-rose-500" />
                                )}
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-foreground mb-1 group-hover/item:text-primary transition-colors">
                                    {insight.title}
                                </h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                    "{insight.description}"
                                </p>
                            </div>
                            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Impact: {insight.impact}</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                                    <span className="text-[8px] font-code text-primary uppercase tracking-tighter">Live Signal</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
