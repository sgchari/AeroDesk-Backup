
'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Operator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Wifi } from 'lucide-react';


const operatorPositions: Record<string, { top: string; left: string }> = {
    // North
    'Delhi': { top: '30%', left: '50%' },
    'Jaipur': { top: '35%', left: '40%' },
    'Chandigarh': { top: '22%', left: '48%' },
    'Lucknow': { top: '34%', left: '60%' },
    // West
    'Mumbai': { top: '50%', left: '20%' },
    'Ahmedabad': { top: '40%', left: '25%' },
    'Pune': { top: '55%', left: '25%' },
    'Goa': { top: '62%', left: '28%' },
    // South
    'Bengaluru': { top: '70%', left: '50%' },
    'Hyderabad': { top: '60%', left: '55%' },
    'Chennai': { top: '75%', left: '60%' },
    'Cochin': { top: '82%', left: '45%' },
    // East
    'Kolkata': { top: '40%', left: '80%' },
    'Guwahati': { top: '30%', left: '90%' },
    'Bhubaneswar': { top: '48%', left: '75%' },
    // Central
    'Bhopal': { top: '45%', left: '50%' },
    'Nagpur': { top: '52%', left: '56%' },
    'Raipur': { top: '49%', left: '65%' },
    'Indore': { top: '44%', left: '40%' },
};

const zoneLabels = {
    North: { top: '15%', left: '45%' },
    West: { top: '45%', left: '10%' },
    Central: { top: '48%', left: '48%' },
    East: { top: '38%', left: '85%' },
    South: { top: '78%', left: '48%' },
};

const getStatusConfig = (status: Operator['status']) => {
    switch (status) {
        case 'Approved':
            return {
                base: 'bg-green-500',
                pulse: 'pulse-green',
                glow: 'shadow-[0_0_12px_2px_rgba(74,222,128,0.5)]',
                label: 'success',
            };
        case 'Pending Approval':
            return {
                base: 'bg-amber-400',
                pulse: 'pulse-amber',
                glow: 'shadow-[0_0_12px_2px_rgba(251,191,36,0.5)]',
                label: 'warning',
            };
        case 'Suspended':
        case 'Rejected':
            return {
                base: 'bg-red-500',
                pulse: 'pulse-red',
                glow: 'shadow-[0_0_12px_2px_rgba(239,68,68,0.5)]',
                label: 'destructive',
            };
        default:
            return {
                base: 'bg-gray-500',
                pulse: '',
                glow: 'shadow-[0_0_12px_2px_rgba(107,114,128,0.5)]',
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
                    className="absolute z-10"
                    style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
                >
                    <div className={cn("relative flex items-center justify-center", isFeatured ? 'w-5 h-5' : 'w-4 h-4')}>
                        {/* Outer pulse/glow ring */}
                        <div className={cn(
                            "absolute rounded-full",
                             isFeatured ? 'w-5 h-5' : 'w-4 h-4',
                             statusConfig.pulse
                        )} />

                        {/* Secondary ring for featured operators */}
                         {isFeatured && (
                            <div className={cn("absolute w-4 h-4 rounded-full border-2", `border-green-400/50`)} />
                         )}

                        {/* Central dot */}
                        <div className={cn("w-2 h-2 rounded-full", statusConfig.base)} />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900/80 border-slate-700 text-white backdrop-blur-md">
                    <p className="font-bold">{operator.companyName}</p>
                    <p className="text-sm text-muted-foreground">{operator.city}</p>
                    <Badge variant={statusConfig.label as any} className="mt-1">{operator.status}</Badge>
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
    
    const featuredOperators = useMemo(() => operators?.filter(op => op.featured), [operators]);

    const lineConnections = useMemo(() => {
        if (!featuredOperators || featuredOperators.length < 2) return [];
        
        const operator1 = featuredOperators.find(op => op.city === 'Mumbai');
        const operator2 = featuredOperators.find(op => op.city === 'Delhi');

        if (operator1 && operator2) {
             const pos1 = operatorPositions[operator1.city!];
             const pos2 = operatorPositions[operator2.city!];
             return [{
                x1: pos1.left, y1: pos1.top,
                x2: pos2.left, y2: pos2.top,
             }]
        }
        return [];
    }, [featuredOperators]);


  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900 text-white flex flex-col">
        <div className="flex-shrink-0 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold font-headline tracking-tight">Operator Network</h1>
            <div className='flex items-center gap-2 text-sm text-green-400'>
                <Wifi size={16} />
                <span>Live Network Status</span>
            </div>
        </div>
        <main className="flex-1 relative flex items-center justify-center">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_rgba(28,61,90,0.3)_0%,_rgba(15,23,42,0)_60%)]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_rgba(54,83,67,0.1),transparent_30%)]" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(54,83,67,0.1),transparent_30%)]" />

            {isLoading ? (
                <Skeleton className="w-[90vw] h-[90vh] max-w-5xl max-h-5xl aspect-[4/5] bg-slate-800/50" />
            ) : (
                <div className="relative w-full h-full max-w-5xl max-h-5xl aspect-[4/5]">
                    {/* India Map SVG */}
                    <svg viewBox="0 0 450 500" className="absolute inset-0 w-full h-full text-slate-700/50" style={{filter: 'drop-shadow(0 0 30px rgba(100, 116, 139, 0.2))'}}>
                       <path fill="currentColor" d="M228.1,2.5c-2.3-2.3-5.7-3.1-8.7-2.1l-1.1,0.4c-0.1,0-0.1,0.1-0.2,0.1L97.5,52.2c-2.8,1.8-4.6,4.9-4.8,8.2l-4.7,69.5 c-0.1,2.2,0.6,4.4,2,6.1l20.4,25.2c1.7,2.1,2.8,4.7,2.8,7.5v28.8c0,3.3-1.5,6.4-4,8.4l-19.8,15.6c-2,1.6-4.5,2.4-7.1,2.4h-38 c-4.6,0-8.3,3.7-8.3,8.3v27c0,4.6,3.7,8.3,8.3,8.3h19.3c3,0,5.8,1.2,7.9,3.4l27.1,27.1c1.5,1.5,2.4,3.6,2.4,5.7v3.2 c0,1.2-0.5,2.4-1.3,3.3l-13.4,14.6c-1.9,2.1-2.9,4.8-2.7,7.5l2.4,37.3c0.3,4,3.6,7.1,7.6,7.1h13.9c1.9,0,3.8,0.7,5.2,2 l14.3,13.8c2.1,2.1,5,3.2,8,3.2h15.9c3.3,0,6.4-1.3,8.7-3.6l45.4-45.4c2.3-2.3,3.6-5.4,3.6-8.7v-21.7c0-2.2-0.9-4.4-2.5-5.9 l-10.1-10.1c-1.6-1.6-2.5-3.8-2.5-5.9V340c0-3-1.2-5.8-3.4-7.9L161,299.5c-2.1-2.1-3.4-5-3.4-8v-10.8c0-3,1.2-5.8,3.4-7.9 l19.4-19.4c2.1-2.1,3.4-5,3.4-8v-11.8c0-1.7-0.7-3.4-1.9-4.6L158,206.1c-1.6-1.6-3.8-2.5-5.9-2.5h-10.1c-4.6,0-8.3-3.7-8.3-8.3 v-11.8c0-3,1.2-5.8,3.4-7.9l36.5-36.5c2.1-2.1,5-3.4,8-3.4h11.8c3,0,5.8,1.2,7.9,3.4l29.4,29.4c1,1,2.4,1.6,3.8,1.6h17.9 c2.1,0,4-0.8,5.5-2.2l30.4-30.4c2.3-2.3,5.4-3.6,8.7-3.6h25.4c4.6,0,8.3,3.7,8.3,8.3v13.6c0,2.1-0.8,4-2.2,5.5l-19.3,19.3 c-1.5,1.5-2.2,3.5-2.2,5.5v19.4c0,4.6,3.7,8.3,8.3,8.3h10c3,0,5.8,1.2,7.9,3.4l27.1,27.1c2.1,2.1,3.4,5,3.4,8V281 c0,4.6-3.7,8.3-8.3,8.3h-10c-3.3,0-6.4,1.3-8.7,3.6L341,338.3c-2.3,2.3-3.6,5.4-3.6,8.7v10c0,3.3,1.3,6.4,3.6,8.7l13.6,13.6 c2.3,2.3,3.6,5.4,3.6,8.7v23.2c0,4.6-3.7,8.3-8.3,8.3h-11.8c-2.8,0-5.4,1.1-7.4,3.1L301,452.4c-2.3,2.3-5.4,3.6-8.7,3.6h-27.6 c-4.6,0-8.3-3.7-8.3-8.3v-11.8c0-3-1.2-5.8-3.4-7.9l-36.5-36.5c-2.1-2.1-5-3.4-8-3.4h-10c-4.6,0-8.3-3.7-8.3-8.3v-10 c0-3.3,1.3-6.4,3.6-8.7l23.2-23.2c2.3-2.3,3.6-5.4,3.6-8.7v-25.4c0-4.6-3.7,8.3-8.3-8.3h-13.6c-3,0-5.8-1.2-7.9-3.4 l-30.4-30.4c-2.3-2.3-5.4-3.6-8.7-3.6h-21.7c-3.3,0-6.4,1.3-8.7,3.6l-21.7,21.7c-2.3,2.3-3.6,5.4-3.6,8.7V340 c0,4.6,3.7,8.3,8.3,8.3h10c3,0,5.8,1.2,7.9,3.4l19.4,19.4c2.1,2.1,3.4,5,3.4,8v11.8c0,4.6-3.7,8.3-8.3,8.3h-10.1 c-2.1,0-4,0.8-5.5,2.2l-23.2,23.2c-1.5,1.5-2.2,3.5-2.2,5.5v19.4c0,3,1.2,5.8,3.4,7.9l27.1,27.1c2.1,2.1,5,3.4,8,3.4h19.3 c4.6,0,8.3,3.7,8.3,8.3v27c0,3.3-1.3,6.4-3.6,8.7L97.9,545.9c-2.3,2.3-3.6,5.4-3.6,8.7V565h209.6l-50.6-50.6 c-2.3-2.3-3.6-5.4-3.6-8.7v-13.6c0-4.6,3.7,8.3,8.3-8.3h10c3,0,5.8-1.2,7.9-3.4l36.5-36.5c2.1-2.1-5-3.4-8-3.4h11.8 c4.6,0,8.3,3.7,8.3,8.3v11.8c0,3-1.2,5.8-3.4,7.9L301,496.6c-2.1-2.1-3.4,5-3.4,8v10.8c0,4.6,3.7,8.3,8.3,8.3h10.1 c2.1,0,4,0.8,5.5,2.2l23.2,23.2c1.5,1.5,2.2,3.5,2.2,5.5v10c0,2.8-1.1,5.4-3.1,7.4L326.4,594c-2,2-3.1,4.7-3.1,7.4V612h27.6 c2.8,0,5.4-1.1,7.4-3.1l31.5-31.5c2-2,3.1-4.7,3.1-7.4v-11.8c0-4.6,3.7-8.3,8.3-8.3h23.2c2.8,0,5.4-1.1,7.4-3.1l13.6-13.6 c2-2,3.1-4.7,3.1-7.4v-27.6c0-2.8-1.1-5.4-3.1-7.4L452.4,470c-2-2-4.7-3.1-7.4-3.1h-11.8c-4.6,0-8.3-3.7-8.3-8.3v-23.2 c0-3-1.2-5.8-3.4-7.9L385,394.1c-2.1-2.1-5-3.4-8-3.4h-10c-4.6,0-8.3-3.7-8.3-8.3V359c0-3.3,1.3-6.4,3.6-8.7l27.1-27.1 c2.1-2.1-5-3.4-8-3.4h10c4.6,0,8.3,3.7,8.3,8.3v19.4c0,2.1-0.8,4-2.2,5.5l-19.3,19.3c-1.5,1.5-2.2,3.5-2.2,5.5v13.6 c0,4.6,3.7,8.3,8.3,8.3h25.4c3.3,0,6.4-1.3,8.7-3.6l30.4-30.4c2.3-2.3,3.6-5.4,3.6-8.7V250c0-3-1.2-5.8-3.4-7.9 l-29.4-29.4c-2.1-2.1-5-3.4-8-3.4h-17.9c-1.4,0-2.8-0.6-3.8-1.6l-36.5-36.5c-2.1-2.1-3.4-5-3.4-8V154 c0-4.6-3.7-8.3-8.3-8.3h-11.8c-3,0-5.8-1.2-7.9-3.4L270.8,119c-2.1-2.1-5-3.4-8-3.4h-11.8c-3,0-5.8,1.2-7.9,3.4 L228.1,134c-1.2,1.2-1.9,2.8-1.9,4.6v11.8c0,4.6,3.7,8.3,8.3,8.3h10.1c2.1,0,4-0.8,5.5-2.2l23.2-23.2c1.5,1.5,2.2-3.5,2.2-5.5 v-10c0-2.8,1.1-5.4,3.1-7.4l17.4-17.4c2-2,3.1-4.7,3.1-7.4V82.3c0-4.6-3.7-8.3-8.3-8.3H301c-3.3,0-6.4,1.3-8.7,3.6 L261.9,108c-2.3,2.3-5.4,3.6-8.7,3.6h-27.6c-4.6,0-8.3-3.7-8.3-8.3V82.3c0-3-1.2-5.8-3.4-7.9L191,51.2c-2.1-2.1-5-3.4-8-3.4 h-19.3c-4.6,0-8.3-3.7-8.3-8.3V14.5c0-3.3,1.3-6.4,3.6-8.7L162.7,2.2C165,0,168.3-0.8,171.3,0.2l1.1,0.4 c0.1,0,0.1,0.1,0.2,0.1L228.1,2.5z" />
                    </svg>

                    {/* Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full z-0 opacity-30" width="100%" height="100%">
                        {lineConnections.map((line, i) => {
                            const [x1, y1] = [parseFloat(line.x1), parseFloat(line.y1)];
                            const [x2, y2] = [parseFloat(line.x2), parseFloat(line.y2)];
                            const cx = (x1 + x2) / 2 + (y1 - y2) * 0.2;
                            const cy = (y1 + y2) / 2 + (x2 - x1) * 0.2;
                            return (
                                <path 
                                    key={i} 
                                    d={`M ${x1}% ${y1}% Q ${cx}% ${cy}%, ${x2}% ${y2}%`} 
                                    stroke="url(#line-gradient)" 
                                    strokeWidth="2" 
                                    fill="none" 
                                    strokeLinecap="round" 
                                />
                            );
                        })}
                        <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: 'rgba(74, 222, 128, 0.5)' }} />
                                <stop offset="100%" style={{ stopColor: 'rgba(74, 222, 128, 0.5)' }} />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Zone Labels */}
                    {Object.entries(zoneLabels).map(([zone, position]) => (
                        <div
                            key={zone}
                            className="absolute z-20 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-slate-300 bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 shadow-lg"
                            style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
                        >
                            {zone}
                        </div>
                    ))}

                    {/* Operator Markers */}
                    {operators?.map(op => <OperatorMarker key={op.id} operator={op} />)}
                </div>
            )}
        </main>
    </div>
  );
}
