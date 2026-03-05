'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Zap, Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
    { label: 'Avg API Response', value: '142ms', status: 'Green', icon: Zap },
    { label: 'Firestore Query', value: '85ms', status: 'Green', icon: Database },
    { label: 'Fn Execution', value: '1.2s', status: 'Yellow', icon: Cloud },
];

export function PerformanceIndicators() {
    return (
        <Card className="bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    Performance Telemetry
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 pt-2">
                {metrics.map(metric => (
                    <div key={metric.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-1.5 rounded-md",
                                metric.status === 'Green' ? "bg-emerald-500/10 text-emerald-500" : 
                                metric.status === 'Yellow' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                            )}>
                                <metric.icon className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{metric.label}</span>
                        </div>
                        <span className={cn(
                            "text-xs font-mono font-bold",
                            metric.status === 'Green' ? "text-emerald-400" : 
                            metric.status === 'Yellow' ? "text-amber-400" : "text-rose-400"
                        )}>{metric.value}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
