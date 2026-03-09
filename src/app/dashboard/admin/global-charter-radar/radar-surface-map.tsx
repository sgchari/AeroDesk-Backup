'use client';

import React from 'react';
import { Radar } from 'lucide-react';

/**
 * Radar Surface Placeholder
 * Temporarily disabled to reduce Turbopack compilation overhead.
 */
export function RadarSurfaceMap({ positions, showHeatmap }: { positions: any[], showHeatmap: boolean }) {
  return (
    <div className="w-full h-full bg-slate-950/80 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)] animate-pulse" />
      
      <div className="p-6 bg-sky-500/10 rounded-full border border-sky-500/20 relative z-10">
        <Radar className="h-12 w-12 text-sky-400" />
      </div>
      
      <div className="text-center space-y-2 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">ADS-B Signal Stream</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Synchronizing with global telemetry grid. Live positioning disabled during system recovery.
        </p>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[8px] font-black text-white/40 uppercase">Telemetry Pulse: Active</span>
        </div>
        <p className="text-[8px] font-code text-sky-400/60 uppercase">Protocol: AERO-ADS-B-SYNC</p>
      </div>
    </div>
  );
}
