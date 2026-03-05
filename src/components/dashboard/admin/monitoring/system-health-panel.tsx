'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, HardDrive, ShieldCheck, Activity } from "lucide-react";
import type { ServiceHealth } from "@/lib/types";
import { cn } from "@/lib/utils";

const services: ServiceHealth[] = [
    { name: 'Authentication Protocol', status: 'Healthy', lastChecked: 'Just now', latency: '42ms' },
    { name: 'Firestore Infrastructure', status: 'Healthy', lastChecked: '2m ago', latency: '18ms' },
    { name: 'Storage Gateway', status: 'Healthy', lastChecked: '5m ago', latency: '120ms' },
    { name: 'Cloud Functions Node', status: 'Warning', lastChecked: '1m ago', latency: '850ms' },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Healthy': return 'bg-emerald-500';
        case 'Warning': return 'bg-amber-500';
        case 'Critical': return 'bg-rose-500';
        default: return 'bg-slate-500';
    }
}

export function SystemHealthPanel() {
    return (
        <Card className="bg-card">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Node Vitality
                </CardTitle>
                <CardDescription>Real-time dependency health status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                {services.map(service => (
                    <div key={service.name} className="flex items-center justify-between group">
                        <div className="space-y-0.5">
                            <p className="text-[11px] font-bold text-white group-hover:text-primary transition-colors">{service.name}</p>
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">
                                Last Checked: {service.lastChecked} • {service.latency}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase text-muted-foreground">{service.status}</span>
                            <div className={cn("w-2 h-2 rounded-full", getStatusColor(service.status), service.status === 'Healthy' ? 'shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'animate-pulse')} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
