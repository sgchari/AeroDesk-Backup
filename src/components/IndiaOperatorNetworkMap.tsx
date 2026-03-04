
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- HUB NODES ---
const hubNodes = [
  { city: 'Delhi', position: [28.6139, 77.2090] as [number, number], label: 'NSOP Operator Base', density: 'high' },
  { city: 'Mumbai', position: [19.0760, 72.8777] as [number, number], label: 'NSOP Operator Base', density: 'high' },
  { city: 'Hyderabad', position: [17.3850, 78.4867] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Chennai', position: [13.0827, 80.2707] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Bengaluru', position: [12.9716, 77.5946] as [number, number], label: 'NSOP Operator Base', density: 'medium' },
  { city: 'Kolkata', position: [22.5726, 88.3639] as [number, number], label: 'NSOP Operator Base', density: 'low' },
];

// --- ACTIVE TELEMETRY ROUTES ---
const activeRoutes = [
  { from: [28.6139, 77.2090] as [number, number], to: [19.0760, 72.8777] as [number, number], label: 'Delhi → Mumbai' },
  { from: [19.0760, 72.8777] as [number, number], to: [12.9716, 77.5946] as [number, number], label: 'Mumbai → Bengaluru' },
  { from: [12.9716, 77.5946] as [number, number], to: [13.0827, 80.2707] as [number, number], label: 'Bengaluru → Chennai' },
  { from: [17.3850, 78.4867] as [number, number], to: [19.0760, 72.8777] as [number, number], label: 'Hyderabad → Mumbai' },
  { from: [22.5726, 88.3639] as [number, number], to: [28.6139, 77.2090] as [number, number], label: 'Kolkata → Delhi' },
  { from: [13.0827, 80.2707] as [number, number], to: [17.3850, 78.4867] as [number, number], label: 'Chennai → Hyderabad' },
];

// --- BEZIER CURVE HELPER ---
function getBezierPoints(start: [number, number], end: [number, number], segments = 80) {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const distLat = end[0] - start[0];
  const distLng = end[1] - start[1];
  const controlLat = midLat - distLng * 0.2;
  const controlLng = midLng + distLat * 0.2;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * controlLat + t ** 2 * end[0];
    const lng = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * controlLng + t ** 2 * end[1];
    points.push([lat, lng]);
  }
  return points;
}

// --- CALC HEADING FOR AIRCRAFT ROTATION ---
function getHeading(start: [number, number], end: [number, number]) {
    const dy = end[0] - start[0];
    const dx = end[1] - start[1];
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    return 90 - theta; // Adjustment for ✈ icon starting position
}

// --- AIRCRAFT ICON COMPONENT ---
const AircraftBeacon = ({ points }: { points: [number, number][] }) => {
  const [index, setIndex] = useState(0);
  const totalPoints = points.length;
  
  useEffect(() => {
    const speed = Math.random() * 50 + 100; // Vary speeds slightly
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= totalPoints - 1 ? 0 : prev + 1));
    }, speed);
    return () => clearInterval(interval);
  }, [totalPoints]);

  const currentPos = points[index];
  const nextPos = points[index + 1] || points[0];
  const heading = getHeading(currentPos, nextPos);

  const aircraftIcon = L.divIcon({
    className: 'aircraft-marker',
    html: `
      <div class="aircraft-container" style="transform: rotate(${heading}deg)">
        <span class="aircraft-glyph">✈</span>
        <div class="aircraft-glow"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker position={currentPos} icon={aircraftIcon} interactive={false} />
  );
};

// --- RADAR SWEEP COMPONENT ---
const RadarSweep = () => {
    const radarIcon = L.divIcon({
        className: 'radar-sweep-icon',
        html: `<div class="radar-beam"></div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });

    return (
        <Marker position={[21.1458, 79.0882]} icon={radarIcon} interactive={false} />
    );
}

// --- CUSTOM RADAR NODE ICON ---
const createRadarNodeIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="radar-node">
        <div class="node-core"></div>
        <div class="radar-pulse"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

export function IndiaOperatorNetworkMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#061122]">
      {/* Institutional radial glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.15),transparent_70%)]" />
      
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        zoomControl={false}
        dragging={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* RADAR SWEEP LAYER */}
        <RadarSweep />

        {/* TELEMETRY MESH (Dotted Network) */}
        {activeRoutes.map((route, idx) => {
          const points = getBezierPoints(route.from, route.to);
          return (
            <React.Fragment key={`route-${idx}`}>
              <Polyline
                positions={points}
                pathOptions={{
                  color: '#00d4ff',
                  weight: 1,
                  opacity: 0.25,
                  dashArray: '2, 6',
                  className: 'telemetry-dotted-mesh'
                }}
              />
              <AircraftBeacon points={points} />
            </React.Fragment>
          );
        })}

        {/* OPERATOR NODES */}
        {hubNodes.map((hub) => (
          <Marker
            key={hub.city}
            position={hub.position}
            icon={createRadarNodeIcon()}
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

      {/* Navy Atmospheric Overlay */}
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
          background-color: rgba(0, 255, 166, 0.2);
          border-radius: 50%;
          animation: pulse-node 2s infinite ease-out;
          z-index: 1;
        }
        @keyframes pulse-node {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        /* Aircraft Glyphs */
        .aircraft-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .aircraft-glyph {
          font-size: 16px;
          color: #00ffa6;
          text-shadow: 0 0 10px #00ffa6;
          z-index: 10;
        }
        .aircraft-glow {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(0, 255, 166, 0.3);
          filter: blur(4px);
          border-radius: 50%;
        }

        /* Radar Sweep Animation */
        .radar-sweep-icon {
            width: 0 !important;
            height: 0 !important;
        }
        .radar-beam {
            position: absolute;
            width: 800px;
            height: 800px;
            background: conic-gradient(from 0deg, rgba(0, 255, 166, 0.15) 0deg, transparent 60deg);
            border-radius: 50%;
            transform-origin: center;
            animation: radar-rotate 5s linear infinite;
            top: -400px;
            left: -400px;
            pointer-events: none;
            z-index: 0;
        }
        @keyframes radar-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Map UI Reset */
        .leaflet-container { background: transparent !important; }
        .custom-map-tooltip {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          backdrop-filter: blur(12px);
          color: white !important;
          padding: 4px 8px !important;
        }
        .leaflet-div-icon { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
}
