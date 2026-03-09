'use client';

import { ShieldAlert } from 'lucide-react';

export function DemoBanner() {
    return (
        <div className="w-full bg-accent h-10 flex items-center justify-center px-4 sticky top-0 z-[100] shadow-md border-b border-black/10">
            <div className="flex items-center gap-2 text-accent-foreground font-black text-[10px] uppercase tracking-[0.2em]">
                <ShieldAlert className="h-4 w-4" />
                <span>Demo Mode – Some actions may be simulated for demonstration purposes.</span>
            </div>
        </div>
    );
}
