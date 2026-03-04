
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '@/lib/utils';

// --- HUB NODES ---
const hubNodes = [
  { city: 'Delhi', position: [28.6139, 77.2090] as [number, number], label: 'NSOP Operator Base', density: 'high' },
  { city: 'Mumbai', position: [19.0760, 72.8777] as [number, number], label: 'NSOP Operator Base', density: 'high' },
  { city: 'Hyderabad', position: [17.3850, 78.4867] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Chennai', position: [13.0827, 80.2707] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Bengaluru', position: [12.9716, 77.5946] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Kolkata', position: [22.5726, 88.3639] as [number, number], label: 'NSOP Operator Base', density: 'low' },
];

// --- ROUTES ---
const routes = [
  { from: [28.6139, 77.2090] as [number, number], to: [19.0760, 72.8777] as [number, number], label: 'Delhi → Mumbai' },
  { from: [19.0760, 72.8777] as [number, number], to: [12.9716, 77.5946] as [number, number], label: 'Mumbai → Bengaluru' },
  { from: [12.9716, 77.5946] as [number, number], to: [13.0827, 80.2707] as [number, number], label: 'Bengaluru → Chennai' },
  { from: [17.3850, 78.4867] as [number, number], to: [19.0760, 72.8777] as [number, number], label: 'Hyderabad → Mumbai' },
  { from: [22.5726, 88.3639] as [number, number], to: [28.6139, 77.2090] as [number, number], label: 'Kolkata → Delhi' },
];

// --- HEATMAP CALIBRATION ---
const heatmapConfig = {
  high: { radius: 180000, opacity: 0.35 },
  medium: { radius: 120000, opacity: 0.2 },
  low: { radius: 80000, opacity: 0.1 },
};

// --- BEZIER CURVE HELPER ---
function getBezierPoints(start: [number, number], end: [number, number], segments = 60) {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  
  // Perpendicular curveness offset
  const distLat = end[0] - start[0];
  const distLng = end[1] - start[1];
  const controlLat = midLat - distLng * 0.25;
  const controlLng = midLng + distLat * 0.25;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * controlLat + t ** 2 * end[0];
    const lng = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * controlLng + t ** 2 * end[1];
    points.push([lat, lng]);
  }
  return points;
}

// --- RADAR ICON ---
const createRadarIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="radar-node">
        <div class="node-core"></div>
        <div class="radar-pulse ring-1"></div>
        <div class="radar-pulse ring-2"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// --- ANIMATED TELEMETRY DOT COMPONENT ---
const TelemetryBeacon = ({ points }: { points: [number, number][] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= points.length - 1 ? 0 : prev + 1));
    }, 120); // Sync with 6-8s loop roughly
    return () => clearInterval(interval);
  }, [points]);

  return (
    <Marker 
      position={points[index]} 
      icon={L.divIcon({
        className: 'telemetry-dot-icon',
        html: `<div class="telemetry-dot"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4],
      })}
      interactive={false}
    />
  );
};

export function IndiaOperatorNetworkMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-slate-950/50 rounded-3xl animate-pulse flex items-center justify-center border border-white/5">
        <p className="text-muted-foreground text-xs uppercase font-black tracking-widest">Synchronizing Spatial Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#061122]">
      {/* Institutional radial glow background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.15),transparent_70%)]" />
      
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        boxZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* FLEET DENSITY HEATMAP LAYER */}
        {hubNodes.map((hub, idx) => {
          const config = heatmapConfig[hub.density as keyof typeof heatmapConfig];
          return (
            <Circle
              key={`heat-${idx}`}
              center={hub.position}
              radius={config.radius}
              pathOptions={{
                fillColor: '#00ffa6',
                fillOpacity: config.opacity,
                color: 'transparent',
                stroke: false,
                className: 'heatmap-blob'
              }}
              interactive={false}
            />
          );
        })}

        {/* ANIMATED MISSION CORRIDORS */}
        {routes.map((route, idx) => {
          const curvePoints = getBezierPoints(route.from, route.to);
          return (
            <React.Fragment key={`route-group-${idx}`}>
              <Polyline
                positions={curvePoints}
                pathOptions={{
                  color: '#00d4ff',
                  weight: 1.5,
                  opacity: 0.4,
                  dashArray: '4, 8',
                  className: 'mission-corridor'
                }}
              >
                <Tooltip sticky className="custom-map-tooltip">
                  <div className="p-1">
                    <p className="text-[10px] font-black uppercase text-accent leading-none">{route.label}</p>
                    <p className="text-[8px] text-white/60 font-bold mt-1 uppercase">Active Charter Corridor</p>
                  </div>
                </Tooltip>
              </Polyline>
              <TelemetryBeacon points={curvePoints} />
            </React.Fragment>
          );
        })}

        {/* RADAR HUB MARKERS */}
        {hubNodes.map((hub) => (
          <Marker
            key={hub.city}
            position={hub.position}
            icon={createRadarIcon()}
          >
            <Tooltip direction="top" offset={[0, -10]} className="custom-map-tooltip">
              <div className="p-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-0">{hub.city}</p>
                <p className="text-[9px] text-white/60 font-bold mt-0">{hub.label}</p>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Navy Atmosphere Filter Overlay */}
      <div className="absolute inset-0 z-20 bg-[#061122]/65 pointer-events-none" />

      <style jsx global>{`
        /* Radar Node Styling */
        .radar-node {
          position: relative;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .node-core {
          width: 6px;
          height: 6px;
          background-color: #00ffa6;
          border-radius: 50%;
          box-shadow: 0 0 12px #00ffa6;
          z-index: 5;
        }
        .radar-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 255, 166, 0.25);
          border-radius: 50%;
          opacity: 0;
          z-index: 1;
        }
        .radar-pulse.ring-1 { animation: pulse-radar 2.5s infinite ease-out; }
        .radar-pulse.ring-2 { animation: pulse-radar 2.5s infinite ease-out 1.25s; }

        @keyframes pulse-radar {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Telemetry Beacon Styling */
        .telemetry-dot {
          width: 4px;
          height: 4px;
          background-color: #fff;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px #00d4ff;
          filter: blur(0.5px);
        }

        /* Heatmap Styling */
        .heatmap-blob {
          filter: blur(40px);
          pointer-events: none;
        }

        /* Map UI Reset */
        .leaflet-container {
          background: transparent !important;
        }
        .custom-map-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6) !important;
          color: white !important;
          padding: 4px 8px !important;
        }
        .leaflet-tooltip-top:before { border-top-color: rgba(15, 23, 42, 0.95) !important; }
        
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
