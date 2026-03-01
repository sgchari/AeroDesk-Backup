'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
    { id: 'quoteAccepted', label: 'Quote' },
    { id: 'manifestApproved', label: 'Manifest' },
    { id: 'paymentConfirmed', label: 'Settlement' },
    { id: 'charterConfirmed', label: 'Confirmed' },
    { id: 'boarding', label: 'Day of Flight' },
    { id: 'flightCompleted', label: 'Completed' },
    { id: 'tripClosed', label: 'Closed' }
];

export function StatusTimeline({ currentStatus }: { currentStatus: string }) {
    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    
    // Group sub-statuses into main steps for display
    const getActiveStepIndex = () => {
        if (['quoteAccepted', 'awaitingManifest'].includes(currentStatus)) return 0;
        if (['manifestSubmitted', 'manifestApproved'].includes(currentStatus)) return 1;
        if (['invoiceIssued', 'paymentSubmitted', 'paymentConfirmed'].includes(currentStatus)) return 2;
        if (['charterConfirmed', 'operationalPreparation', 'preFlightReady'].includes(currentStatus)) return 3;
        if (['boarding', 'departed', 'arrived'].includes(currentStatus)) return 4;
        if (currentStatus === 'flightCompleted') return 5;
        if (currentStatus === 'tripClosed') return 6;
        return -1;
    };

    const activeIndex = getActiveStepIndex();

    return (
        <div className="w-full py-8 px-4 bg-black/20 rounded-xl border border-white/5">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-accent transition-all duration-1000 -translate-y-1/2 z-0" 
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                isCompleted ? "bg-accent border-accent text-accent-foreground" : 
                                isActive ? "bg-background border-accent text-accent scale-110 shadow-[0_0_15px_rgba(255,255,189,0.3)]" : 
                                "bg-muted border-white/10 text-muted-foreground"
                            )}>
                                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-[10px] font-bold">{idx + 1}</span>}
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest absolute top-10 whitespace-nowrap",
                                isActive ? "text-accent" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
