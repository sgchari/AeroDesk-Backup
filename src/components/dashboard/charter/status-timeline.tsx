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
    // Group sub-statuses into main steps for display
    const getActiveStepIndex = () => {
        if (!currentStatus) return -1;
        const status = currentStatus.toLowerCase();
        
        if (['quoteaccepted', 'awaitingmanifest'].includes(status)) return 0;
        if (['manifestsubmitted', 'manifestapproved'].includes(status)) return 1;
        if (['invoiceissued', 'paymentsubmitted', 'paymentconfirmed'].includes(status)) return 2;
        if (['charterconfirmed', 'operationalpreparation', 'preflightready'].includes(status)) return 3;
        if (['boarding', 'departed', 'arrived', 'live', 'enroute'].includes(status)) return 4;
        if (status === 'flightcompleted') return 5;
        if (status === 'tripclosed') return 6;
        return -1;
    };

    const activeIndex = getActiveStepIndex();

    return (
        <div className="w-full py-8 px-4 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            <div className="relative flex justify-between max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-4 left-0 h-0.5 bg-accent transition-all duration-1000 -translate-y-1/2 z-0 shadow-[0_0_10px_rgba(255,255,189,0.3)]" 
                    style={{ width: `${activeIndex >= 0 ? (activeIndex / (steps.length - 1)) * 100 : 0}%` }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                (isCompleted || isActive) ? "bg-accent border-accent text-accent-foreground" : 
                                "bg-muted border-white/10 text-muted-foreground"
                            )}
                            style={isActive ? { boxShadow: '0 0 15px rgba(255,255,189,0.4)', transform: 'scale(1.15)' } : {}}
                            >
                                {isCompleted ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <span className="text-[10px] font-black">{idx + 1}</span>
                                )}
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest absolute top-10 whitespace-nowrap transition-colors",
                                isActive ? "text-accent" : isCompleted ? "text-white/80" : "text-muted-foreground"
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
