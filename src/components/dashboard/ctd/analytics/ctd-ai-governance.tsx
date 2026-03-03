'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, ShieldCheck, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const insights = [
    {
        type: 'BUDGET',
        title: 'Cost Overrun Risk',
        description: 'R&D Special Projects cost center has consumed 90% of its quarterly allocation. Suggest migrating short-haul missions to jet seat (EL) model.',
        impact: 'High',
        trend: 'up',
        color: 'text-amber-400'
    },
    {
        type: 'GOVERNANCE',
        title: 'Policy Deviation Detected',
        description: 'Increased frequency of international charter requests without standard executive justification. Flagging for workflow review.',
        impact: 'Medium',
        trend: 'up',
        color: 'text-rose-500'
    },
    {
        type: 'OPTIMIZATION',
        title: 'Yield Opportunity',
        description: 'Regular travel on BOM-DEL sectors detected. Switching to long-term operator block contracts could reduce annual spend by 12%.',
        impact: 'High',
        trend: 'up',
        color: 'text-sky-400'
    }
];

export function CTDAIGovernance() {
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
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">Governance Intelligence Layer</h3>
                        <p className="text-[10px] text-muted-foreground font-bold">CROSS-DEPARTMENTAL SPEND ANOMALIES & COMPLIANCE SIGNALS</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-black/20 text-primary border-primary/20 font-code text-[10px]">
                        AI POLICY GUARD ACTIVE
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
