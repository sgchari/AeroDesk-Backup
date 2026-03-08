'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, CheckCircle2, ChevronRight, AlertCircle, Clock, Zap } from 'lucide-react';
import { useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { CharterRFQ } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const opSteps = [
    { id: 'operationalPreparation', label: 'Prep Ops' },
    { id: 'preFlightReady', label: 'Brief Ready' },
    { id: 'boarding', label: 'Boarding' },
    { id: 'departed', label: 'Departed' },
    { id: 'arrived', label: 'Arrived' },
    { id: 'flightCompleted', label: 'Completed' },
    { id: 'tripClosed', label: 'Close Trip' }
];

export function OperationalPanel({ charter, userRole }: { charter: CharterRFQ, userRole?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const isOperator = userRole === 'Operator';
    const isConfirmed = [
        'charterConfirmed', 
        'operationalPreparation', 
        'preFlightReady', 
        'boarding', 
        'departed', 
        'arrived', 
        'flightCompleted',
        'live',
        'enroute'
    ].includes(charter.status);

    const handleStatusUpdate = (status: string) => {
        if (!firestore) return;

        const path = `charterRequests/${charter.id}`;
        updateDocumentNonBlocking({ path } as any, { status });

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            charterId: charter.id,
            actionType: `OPERATIONAL_STATUS_CHANGE`,
            performedBy: 'Ops Desk',
            role: 'Operator',
            previousStatus: charter.status,
            newStatus: status,
            timestamp: new Date().toISOString()
        });

        toast({ title: "Operational State Updated", description: `Mission is now marked as ${status}.` });
    };

    if (!isConfirmed && !isOperator) return null;

    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Plane className="h-4 w-4 text-accent" />
                    Operational Control
                </CardTitle>
                <CardDescription>Mission logistics and execution tracking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {!isConfirmed ? (
                    <div className="p-8 text-center rounded-lg border-2 border-dashed border-white/5 bg-muted/5 opacity-50">
                        <Clock className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Awaiting Confirmation Protocol</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {isOperator && charter.status !== 'tripClosed' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {opSteps.map(step => {
                                    const isNext = opSteps.findIndex(s => s.id === step.id) === opSteps.findIndex(s => s.id === charter.status) + 1 || (charter.status === 'charterConfirmed' && step.id === 'operationalPreparation');
                                    const isCurrent = charter.status === step.id;

                                    return (
                                        <Button 
                                            key={step.id} 
                                            variant={isCurrent ? "accent" : "outline"} 
                                            size="sm"
                                            disabled={!isNext && !isCurrent}
                                            onClick={() => handleStatusUpdate(step.id)}
                                            className={cn(
                                                "text-[9px] font-black uppercase tracking-widest h-8 px-1",
                                                isNext && "border-accent/40 text-accent animate-pulse"
                                            )}
                                        >
                                            {step.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-accent" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{charter.departure}</span>
                                </div>
                                <div className="flex-1 border-t-2 border-dotted border-accent/20 mx-4" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-widest">{charter.arrival}</span>
                                    <MapPin className="h-4 w-4 text-accent" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-1">
                                    <p className="text-[8px] uppercase text-muted-foreground font-black">Asset Status</p>
                                    <p className="text-[10px] font-bold text-accent uppercase">{charter.status}</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-1 text-right">
                                    <p className="text-[8px] uppercase text-muted-foreground font-black">ETA Destination</p>
                                    <p className="text-[10px] font-bold text-foreground">ON SCHEDULE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}