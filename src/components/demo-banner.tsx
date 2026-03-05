
'use client';

import { ShieldAlert } from 'lucide-react';

export function DemoBanner() {
    return (
        <div className="w-full bg-[#FFD166] h-10 flex items-center justify-center px-4 sticky top-0 z-[100] shadow-md border-b border-black/10">
            <div className="flex items-center gap-2 text-[#1B263B] font-black text-[10px] uppercase tracking-[0.2em]">
                <ShieldAlert className="h-4 w-4" />
                <span>Demo Environment — All data is simulated. Production logic protected.</span>
            </div>
        </div>
    );
}
