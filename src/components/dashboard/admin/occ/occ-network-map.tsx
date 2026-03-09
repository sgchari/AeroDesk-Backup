'use client';

import React from 'react';
import { Network, Layers } from 'lucide-react';

/**
 * OCC Network Placeholder
 * Temporarily disabled to optimize dashboard load times.
 */
export function OCCNetworkMap() {
  return (
    <div className="w-full h-full bg-[#061122] rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-6 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 relative z-10">
        <Network className="h-10 w-10 text-emerald-400" />
      </div>

      <div className="text-center space-y-3 relative z-10">
        <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">OCC Command Interface</h3>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-8">
          Interactive situational awareness layers are temporarily in standby mode. 
          Mission data processing continues in the operational feed.
        </p>
      </div>

      <div className="absolute top-4 left-4 z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-2 min-w-[160px] opacity-50">
          <div className="flex items-center gap-2 border-b border-white/5 pb-1 mb-1">
            <Layers className="h-3 w-3 text-accent" />
            <span className="text-[8px] font-black uppercase text-white">Layers Paused</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full" />
          <div className="h-1.5 w-2/3 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
