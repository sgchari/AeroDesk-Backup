'use client';

import React from 'react';
import type { OperationalActivity } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FilePlus, CheckCircle2, Zap, Armchair, Clock } from "lucide-react";

interface OperationalFeedProps {
    activities: OperationalActivity[];
}

const getIcon = (type: string) => {
    switch (type) {
        case 'rfq_created': return <FilePlus className="h-3 w-3 text-primary" />;
        case 'quote_accepted': return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
        case 'empty_leg_published': return <Zap className="h-3 w-3 text-accent" />;
        case 'seat_booked': return <Armchair className="h-3 w-3 text-sky-400" />;
        default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
};

export function OperationalFeed({ activities }: OperationalFeedProps) {
    return (
        <div className="h-full overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {activities.length > 0 ? activities.map((act, idx) => (
                <div key={act.id} className="relative pl-6 pb-4 border-l border-white/5 last:pb-0">
                    <div className="absolute left-[-13px] top-0 p-1.5 rounded-full bg-slate-900 border border-white/10 shadow-lg">
                        {getIcon(act.type)}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">
                                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[8px] font-code text-accent bg-accent/5 px-1.5 rounded uppercase">
                                {act.entityId}
                            </span>
                        </div>
                        <p className="text-[11px] font-bold text-foreground leading-tight">{act.message}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">
                            Actor: {act.actor}
                        </p>
                    </div>
                </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                    <Clock className="h-8 w-8" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Grid Signals...</p>
                </div>
            )}
        </div>
    );
}
