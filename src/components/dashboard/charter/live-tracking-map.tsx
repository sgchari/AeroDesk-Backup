
'use client';

import React, { useEffect, useState } from 'react';
import { indiaPath, hubCoordinates } from '@/lib/geo-utils';
import { Badge } from '@/components/ui/badge';

interface LiveTrackingMapProps {
    origin: string;
    destination: string;
    departureTime?: string;
}

export function LiveTrackingMap({ origin, destination }: LiveTrackingMapProps) {
    const [progress, setProgress] = useState(0.45); // Simulation start

    // Extract core city name for coordinate lookup
    const originCity = origin.split(' (')[0];
    const destCity = destination.split(' (')[0];

    const from = hubCoordinates[originCity] || hubCoordinates['Mumbai'];
    const to = hubCoordinates[destCity] || hubCoordinates['Delhi'];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 1 ? 0 : prev + 0.001));
        }, 150);
        return () => clearInterval(interval);
    }, []);

    const currentX = from.x + (to.x - from.x) * progress;
    const currentY = from.y + (to.y - from.y) * progress;

    const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

    return (
        <div className="relative w-full aspect-video bg-black/40 rounded-xl border border-white/10 overflow-hidden group">
            {/* Visual Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)] animate-pulse" />
            
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[7px] font-black uppercase tracking-widest gap-1.5 h-5 px-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-blink" />
                    Radar Active
                </Badge>
                <div className="p-1.5 rounded bg-black/60 backdrop-blur-md border border-white/5">
                    <p className="text-[6px] text-muted-foreground uppercase font-black tracking-widest">Ground Speed</p>
                    <p className="text-[10px] font-mono font-bold text-white">425 KT</p>
                </div>
            </div>

            <div className="absolute bottom-3 right-3 z-20 text-right">
                <p className="text-[7px] text-muted-foreground uppercase font-black tracking-widest">Sector Index</p>
                <p className="text-[9px] font-bold text-accent uppercase tracking-tighter">{originCity} » {destCity}</p>
            </div>

            <svg viewBox="0 0 1000 1000" className="w-full h-full p-6 opacity-80 group-hover:opacity-100 transition-opacity">
                <defs>
                    <pattern id="dotPatternLive" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 189, 0.15)" />
                    </pattern>
                    <clipPath id="indiaClipLive">
                        <path d={indiaPath} />
                    </clipPath>
                </defs>

                <path d={indiaPath} fill="rgba(255,255,189,0.02)" stroke="rgba(255,255,189,0.05)" strokeWidth="1" />
                <rect width="1000" height="1000" fill="url(#dotPatternLive)" clipPath="url(#indiaClipLive)" />

                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(14,165,233,0.2)" strokeWidth="2" strokeDasharray="4,4" />

                <g>
                    <circle cx={from.x} cy={from.y} r="10" fill="#0EA5E9" className="opacity-50" />
                    <circle cx={to.x} cy={to.y} r="10" fill="#F43F5E" className="opacity-50" />
                </g>

                <g transform={`translate(${currentX}, ${currentY}) rotate(${angle})`}>
                    <circle r="30" fill="rgba(14,165,233,0.2)" className="animate-ping" />
                    <path d="M15 12L3 20V4L15 12Z" fill="#0EA5E9" transform="translate(-12, -16) scale(1.8)" className="drop-shadow-[0_0_12px_#0EA5E9]" />
                </g>
            </svg>
        </div>
    );
}
