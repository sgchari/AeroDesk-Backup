
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Operator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { Info, ShieldCheck, Zap } from 'lucide-react';

const operatorPositions: Record<string, { top: string; left: string }> = {
    // North
    'Delhi': { top: '22%', left: '48%' },
    'Chandigarh': { top: '16%', left: '46%' },
    'Lucknow': { top: '28%', left: '58%' },
    'Jaipur': { top: '30%', left: '42%' },
    // West
    'Mumbai': { top: '58%', left: '32%' },
    'Ahmedabad': { top: '45%', left: '30%' },
    'Pune': { top: '62%', left: '36%' },
    'Goa': { top: '72%', left: '38%' },
    // South
    'Bengaluru': { top: '78%', left: '48%' },
    'Hyderabad': { top: '65%', left: '52%' },
    'Chennai': { top: '82%', left: '58%' },
    'Cochin': { top: '88%', left: '45%' },
    // East
    'Kolkata': { top: '48%', left: '82%' },
    'Bhubaneswar': { top: '58%', left: '75%' },
    // Central
    'Bhopal': { top: '46%', left: '50%' },
    'Nagpur': { top: '55%', left: '55%' },
    'Indore': { top: '48%', left: '43%' },
    'Raipur': { top: '52%', left: '62%' },
    // North East
    'Guwahati': { top: '35%', left: '92%' },
};

const getStatusConfig = (status: Operator['status']) => {
    switch (status) {
        case 'Approved':
            return {
                base: 'bg-green-400',
                pulse: 'pulse-green',
                label: 'success',
            };
        case 'Pending Approval':
            return {
                base: 'bg-amber-400',
                pulse: 'pulse-amber',
                label: 'warning',
            };
        case 'Suspended':
        case 'Rejected':
            return {
                base: 'bg-red-500',
                pulse: 'pulse-red',
                label: 'destructive',
            };
        default:
            return {
                base: 'bg-slate-400',
                pulse: '',
                label: 'secondary',
            };
    }
};

const OperatorMarker = ({ operator }: { operator: Operator }) => {
    const position = operator.city ? operatorPositions[operator.city] : null;
    if (!position) return null;

    const statusConfig = getStatusConfig(operator.status);
    const isFeatured = operator.featured;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    className="absolute z-30"
                    style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
                >
                    <div className={cn("relative flex items-center justify-center", isFeatured ? 'w-5 h-5' : 'w-3 h-3')}>
                        <div className={cn(
                            "absolute rounded-full",
                             isFeatured ? 'w-6 h-6 border border-white/30' : 'w-4 h-4',
                             statusConfig.pulse
                        )} />
                        <div className={cn(
                            "rounded-full transition-transform hover:scale-150 duration-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]", 
                            isFeatured ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5',
                            statusConfig.base
                        )} />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-950/90 text-white border-white/10 backdrop-blur-md p-3">
                    <div className="space-y-1">
                        <p className="font-bold text-sm tracking-tight">{operator.companyName}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Info className="w-3 h-3" /> {operator.city}, India
                        </p>
                        <div className="pt-1">
                            <Badge variant={statusConfig.label as any} className="text-[10px] h-4 px-1.5">
                                {operator.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default function OurNetworkPage() {
    const firestore = useFirestore();
    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'operators');
    }, [firestore]);
    
    const { data: operators, isLoading } = useCollection<Operator>(operatorsQuery, 'operators');

    return (
        <div className="w-full">
            {/* Background Layer: Consistent Homepage Atmosphere */}
            <div
                className="fixed inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
                <LandingHeader activePage="Our Network" />
                
                <main className="flex-1 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="container relative z-10 max-w-6xl w-full h-[70vh] min-h-[500px]">
                        
                        {/* Legend / Stats Panel */}
                        <div className="absolute top-0 left-0 z-40 w-full sm:w-72 bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
                            <div className="space-y-1 border-b border-white/10 pb-3">
                                <h2 className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-accent" /> Network Intel
                                </h2>
                                <p className="text-xs text-slate-300">Approved NSOP Infrastructure India</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400" /> Active Operators
                                    </span>
                                    <span className="text-white font-mono">{operators?.filter(o => o.status === 'Approved').length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-400" /> Pending Review
                                    </span>
                                    <span className="text-white font-mono">{operators?.filter(o => o.status === 'Pending Approval').length || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-300 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" /> Suspended
                                    </span>
                                    <span className="text-white font-mono">{operators?.filter(o => ['Suspended', 'Rejected'].includes(o.status)).length || 0}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <p className="text-[10px] leading-relaxed text-slate-400 italic">
                                        "AeroDesk enforces institutional governance across all operational sectors. Status updates are synchronized in real-time."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Zonal Map SVG Container */}
                        <div className="relative w-full h-full flex items-center justify-center bg-black/10 backdrop-blur-[2px] rounded-3xl border border-white/5 shadow-inner">
                            <svg viewBox="0 0 1000 800" className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                {/* North Zone */}
                                <path 
                                    d="M250 50 L550 50 L650 350 L350 350 Z" 
                                    fill="rgba(99, 102, 241, 0.25)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />
                                
                                {/* West Zone */}
                                <path 
                                    d="M50 350 L350 350 L400 650 L50 750 Z" 
                                    fill="rgba(37, 99, 235, 0.25)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />

                                {/* East Zone */}
                                <path 
                                    d="M650 350 L950 350 L900 550 L650 550 Z" 
                                    fill="rgba(6, 182, 212, 0.25)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />

                                {/* Central Zone */}
                                <path 
                                    d="M350 350 L650 350 L650 550 L400 550 Z" 
                                    fill="rgba(59, 130, 246, 0.15)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />

                                {/* South Zone */}
                                <path 
                                    d="M400 550 L650 550 L600 780 L450 780 Z" 
                                    fill="rgba(16, 185, 129, 0.25)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />

                                {/* North East Zone */}
                                <path 
                                    d="M750 250 L980 250 L980 450 L850 450 Z" 
                                    fill="rgba(34, 211, 238, 0.3)" 
                                    stroke="rgba(255,255,255,0.6)" 
                                    strokeWidth="2" 
                                />
                            </svg>

                            {/* Floating HTML Labels */}
                            <div className="absolute top-[15%] left-[50%] -translate-x-1/2 pointer-events-none">
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Sector North</span>
                            </div>
                            <div className="absolute top-[65%] left-[25%] pointer-events-none">
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Sector West</span>
                            </div>
                            <div className="absolute top-[65%] left-[75%] pointer-events-none">
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Sector East</span>
                            </div>
                            <div className="absolute top-[45%] left-[50%] -translate-x-1/2 pointer-events-none">
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Central Command</span>
                            </div>
                            <div className="absolute top-[85%] left-[50%] -translate-x-1/2 pointer-events-none">
                                <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">Sector South</span>
                            </div>

                            {/* Operator Markers */}
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Skeleton className="w-32 h-32 rounded-full bg-white/5" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 pointer-events-auto">
                                    {operators?.map(op => <OperatorMarker key={op.id} operator={op} />)}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <LandingFooter />
            </div>
        </div>
    );
}
