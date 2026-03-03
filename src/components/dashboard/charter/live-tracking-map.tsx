'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { indiaPath, hubCoordinates } from '@/lib/geo-utils';
import { Plane, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LiveTrackingMapProps {
    origin: string;
    destination: string;
    departureTime?: string;
}

export function LiveTrackingMap({ origin, destination, departureTime }: LiveTrackingMapProps) {
    const [progress, setProgress] = useState(0.45); // Start at 45% for visual impact

    // Parse city names from strings like "Mumbai (VABB)"
    const originCity = origin.split(' (')[0];
    const destCity = destination.split(' (')[0];

    const from = hubCoordinates[originCity] || hubCoordinates['Mumbai'];
    const to = hubCoordinates[destCity] || hubCoordinates['Delhi'];

    // Simulation: Move plane slightly over time
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 1 ? 0 : prev + 0.001));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const currentX = from.x + (to.x - from.x) * progress;
    const currentY = from.y + (to.y - from.y) * progress;

    // Calculate rotation angle for plane icon
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

    return (
        <div className="relative w-full aspect-square md:aspect-video bg-black/40 rounded-xl border border-white/10 overflow-hidden group">
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)] animate-pulse" />
            
            {/* Status Overlays */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[8px] font-black uppercase tracking-widest gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink" />
                    Live Radar Ping
                </Badge>
                <div className="p-2 rounded bg-black/60 backdrop-blur-md border border-white/5 space-y-1">
                    <p className="text-[7px] text-muted-foreground uppercase font-bold tracking-widest">Ground Speed</p>
                    <p className="text-xs font-mono font-bold text-white">425 KT</p>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 z-20 text-right">
                <p className="text-[8px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Satellite Context</p>
                <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">Corridor: {originCity} - {destCity}</p>
            </div>

            {/* SVG Map Layer */}
            <svg viewBox="0 0 1000 1000" className="w-full h-full p-8 md:p-12 opacity-80 transition-opacity group-hover:opacity-100">
                <defs>
                    <pattern id="dotPatternLive" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 189, 0.15)" />
                    </pattern>
                    <clipPath id="indiaClipLive">
                        <path d={indiaPath} />
                    </clipPath>
                </defs>

                {/* India Background */}
                <path d={indiaPath} fill="rgba(255,255,189,0.02)" stroke="rgba(255,255,189,0.05)" strokeWidth="1" />
                <rect width="1000" height="1000" fill="url(#dotPatternLive)" clipPath="url(#indiaClipLive)" />

                {/* Mission Route Line */}
                <line 
                    x1={from.x} y1={from.y} 
                    x2={to.x} y2={to.y} 
                    stroke="rgba(14,165,233,0.2)" 
                    strokeWidth="2" 
                    strokeDasharray="4,4" 
                />

                {/* Hub Markers */}
                <g>
                    <circle cx={from.x} cy={from.y} r="4" fill="#0EA5E9" className="opacity-50" />
                    <circle cx={to.x} cy={to.y} r="4" fill="#F43F5E" className="opacity-50" />
                </g>

                {/* Aircraft Position Marker */}
                <g transform={`translate(${currentX}, ${currentY}) rotate(${angle})`}>
                    <circle r="12" fill="rgba(14,165,233,0.15)" className="animate-ping" />
                    <path 
                        d="M15 12L3 20V4L15 12Z" 
                        fill="#0EA5E9" 
                        transform="translate(-9, -12) scale(0.8)"
                        className="drop-shadow-[0_0_8px_#0EA5E9]"
                    />
                </g>
            </svg>
        </div>
    );
}
