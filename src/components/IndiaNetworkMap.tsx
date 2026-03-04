'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3-geo';
import { indiaGeoJson } from '@/lib/geo-utils';
import { cn } from '@/lib/utils';

interface Hub {
  city: string;
  lat: number;
  lng: number;
  label: string;
}

const hubs: Hub[] = [
  { city: 'Delhi', lat: 28.6139, lng: 77.2090, label: 'Delhi NCR Hub' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, label: 'Mumbai Metro Hub' },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, label: 'Hyderabad Tech Hub' },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, label: 'Chennai Port Hub' },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, label: 'South Zone Hub' },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, label: 'East Zone Hub' },
];

export function IndiaNetworkMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredHub, setHoveredHub] = useState<Hub | null>(null);

  // Responsive container sizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Compute projection and path
  const { pathData, projectedHubs } = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return { pathData: '', projectedHubs: [] };

    // Strict D3 Projection Configuration
    const projection = d3.geoMercator()
      .fitSize([dimensions.width, dimensions.height], indiaGeoJson);

    const geoPath = d3.geoPath().projection(projection);
    const mainPath = geoPath(indiaGeoJson);

    const mappedHubs = hubs.map(hub => {
      const projected = projection([hub.lng, hub.lat]);
      return {
        ...hub,
        x: projected ? projected[0] : 0,
        y: projected ? projected[1] : 0,
      };
    });

    return { pathData: mainPath, projectedHubs: mappedHubs };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[650px] relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="emeraldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(0, 212, 255, 0.15)" />
          </linearGradient>
        </defs>

        {/* India Map Boundary */}
        <path
          d={pathData || ''}
          fill="url(#mapGradient)"
          stroke="#00d4ff"
          strokeWidth="1.5"
          className="transition-all duration-1000 ease-in-out opacity-40 hover:opacity-60"
        />

        {/* Hub Connectors (Subtle Network Grid) */}
        <g className="opacity-10">
          {projectedHubs.map((h1, i) => 
            projectedHubs.slice(i + 1).map((h2, j) => (
              <line
                key={`${h1.city}-${h2.city}`}
                x1={h1.x} y1={h1.y}
                x2={h2.x} y2={h2.y}
                stroke="#00d4ff"
                strokeWidth="0.5"
                strokeDasharray="4,4"
              />
            ))
          )}
        </g>

        {/* Hub Markers */}
        {projectedHubs.map((hub) => (
          <g
            key={hub.city}
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredHub(hub)}
            onMouseLeave={() => setHoveredHub(null)}
          >
            {/* Pulsing ring for high-priority hubs */}
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hoveredHub?.city === hub.city ? 12 : 8}
              fill="#00ffa6"
              className="animate-ping opacity-20"
            />
            
            {/* Core Marker */}
            <circle
              cx={hub.x}
              cy={hub.y}
              r={hoveredHub?.city === hub.city ? 6 : 4}
              fill="#00ffa6"
              filter="url(#emeraldGlow)"
              style={{ filter: 'drop-shadow(0 0 8px #00ffa6)' }}
              className="transition-all duration-300"
            />

            {/* Hub Label */}
            <text
              x={hub.x}
              y={hub.y - 12}
              textAnchor="middle"
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest fill-white transition-opacity duration-300 pointer-events-none",
                hoveredHub?.city === hub.city ? "opacity-100" : "opacity-0"
              )}
            >
              {hub.city}
            </text>
          </g>
        ))}
      </svg>

      {/* Collision-Aware Data Tooltip */}
      {hoveredHub && (
        <div 
          className="absolute z-50 pointer-events-none transition-all duration-300"
          style={{ 
            left: `${(hoveredHub.lng > 82 ? -240 : 20) + (hubToX(hoveredHub, dimensions))}px`,
            top: `${(hoveredHub.lat < 15 ? -140 : 20) + (hubToY(hoveredHub, dimensions))}px`
          }}
        >
          <div className="w-56 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ffa6]">{hoveredHub.city} Sector</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa6] animate-pulse" />
            </div>
            <p className="text-xs font-medium text-white leading-relaxed">
              {hoveredHub.label} • Primary coordination node for AeroDesk NSOP network.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase text-muted-foreground">Fleet</p>
                <p className="text-[10px] font-bold text-white">4+ Active</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase text-muted-foreground">Stays</p>
                <p className="text-[10px] font-bold text-white">6+ Hubs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers for the tooltip positioning since we can't easily access the internal projection from outside
function hubToX(hub: Hub, dims: {width: number, height: number}) {
    const proj = d3.geoMercator().fitSize([dims.width, dims.height], indiaGeoJson);
    const p = proj([hub.lng, hub.lat]);
    return p ? p[0] : 0;
}

function hubToY(hub: Hub, dims: {width: number, height: number}) {
    const proj = d3.geoMercator().fitSize([dims.width, dims.height], indiaGeoJson);
    const p = proj([hub.lng, hub.lat]);
    return p ? p[1] : 0;
}
