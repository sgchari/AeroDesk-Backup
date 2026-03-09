'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export function IndiaOperatorNetworkMap() {
  return (
    <div className="w-full h-full min-h-[500px] bg-slate-950/50 rounded-3xl border border-white/5 flex flex-col items-center justify-center space-y-4">
      <div className="p-4 bg-accent/10 rounded-full">
        <Activity className="h-8 w-8 text-accent animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">National Intelligence Grid</p>
        <p className="text-xs text-muted-foreground italic">Restoring institutional synchronization...</p>
      </div>
    </div>
  );
}
