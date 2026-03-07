'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Clock, ShieldCheck, CreditCard, Plane } from 'lucide-react';
import type { SeatRequestStatus } from '@/lib/types';

const steps = [
    { id: 'REQUEST_SUBMITTED', label: 'Request Submitted', icon: Clock },
    { id: 'PENDING_OPERATOR_APPROVAL', label: 'Operator Review', icon: ShieldCheck },
    { id: 'APPROVED', label: 'Invoice Issued', icon: CreditCard },
    { id: 'PAYMENT_SUBMITTED', label: 'Payment Submitted', icon: Clock },
    { id: 'CONFIRMED', label: 'Seat Confirmed', icon: Plane }
];

export function SeatBookingProgressTracker({ currentStatus }: { currentStatus: SeatRequestStatus }) {
    const getActiveStepIndex = () => {
        if (currentStatus === 'REJECTED') return -1;
        if (currentStatus === 'REQUEST_SUBMITTED') return 0;
        if (currentStatus === 'PENDING_OPERATOR_APPROVAL') return 1;
        if (['APPROVED', 'WAITING_PAYMENT'].includes(currentStatus)) return 2;
        if (currentStatus === 'PAYMENT_SUBMITTED') return 3;
        if (['PAYMENT_CONFIRMED', 'CONFIRMED', 'COMPLETED'].includes(currentStatus)) return 4;
        return 0;
    };

    const activeIndex = getActiveStepIndex();

    return (
        <div className="w-full py-10 px-6 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldCheck className="h-40 w-40 -mr-12 -mt-12 text-accent" />
            </div>
            
            <div className="relative flex justify-between max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-5 left-0 h-0.5 bg-accent transition-all duration-1000 -translate-y-1/2 z-0 shadow-[0_0_10px_hsl(var(--accent))]" 
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, idx) => {
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    const StepIcon = step.icon;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                isCompleted ? "bg-accent border-accent text-accent-foreground" : 
                                isActive ? "bg-slate-900 border-accent text-accent scale-125 shadow-[0_0_20px_rgba(255,255,189,0.4)]" : 
                                "bg-slate-950 border-white/10 text-white/20"
                            )}>
                                {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                            </div>
                            <div className="text-center space-y-1">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap block transition-colors",
                                    isActive ? "text-accent" : isCompleted ? "text-white/80" : "text-white/20"
                                )}>
                                    {step.label}
                                </span>
                                {isActive && (
                                    <Badge variant="outline" className="h-4 border-accent/20 bg-accent/5 text-[7px] font-black uppercase tracking-widest text-accent px-1.5">
                                        Active Phase
                                    </Badge>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
