'use client';

import React from 'react';
import { Plane, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LiveTrackingMapProps {
    origin: string;
    destination: string;
}

/**
 * Live Tracking Placeholder - Safe Mode
 * Lightweight version for environment recovery. Prevents high-memory map execution.
 */
export function LiveTrackingMap({ origin, destination }: LiveTrackingMapProps) {
    const originCity = origin.split(' (')[0];
    const destCity = destination.split(' (')[0];

    return (
        <div className="relative w-full aspect-video bg-slate-950/80 rounded-xl border border-white/10 flex flex-col items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0%,transparent_70%)]" />
            </div>

            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[7px] font-black uppercase tracking-widest gap-1.5 h-5 px-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    Mission Active
                </Badge>
            </div>

            <div className="flex items-center gap-8 relative z-10">
                <div className="text-center space-y-1">
                    <p className="text-[8px] text-muted-foreground uppercase font-black">Origin</p>
                    <p className="text-sm font-bold text-white uppercase">{originCity}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent relative">
                        <Plane className="h-4 w-4 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 drop-shadow-[0_0_8px_rgba(255,255,189,0.5)]" />
                    </div>
                    <Badge variant="outline" className="text-[7px] border-white/5 text-white/40 uppercase">Safe-Mode Tracking</Badge>
                </div>
                <div className="text-center space-y-1">
                    <p className="text-[8px] text-muted-foreground uppercase font-black">Arrival</p>
                    <p className="text-sm font-bold text-white uppercase">{destCity}</p>
                </div>
            </div>

            <div className="absolute bottom-3 right-3 z-20">
                <p className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Telemetry Node</p>
                <p className="text-[9px] font-bold text-accent uppercase tracking-tighter">AERO-RECOVERY-ACTIVE</p>
            </div>
        </div>
    );
}
