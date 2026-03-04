
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, Activity } from 'lucide-react';

// --- HUB NODES ---
const hubNodes = [
  { city: 'Delhi', position: [28.6139, 77.2090] as [number, number], label: 'NSOP Operator Base', density: 'high', type: 'Backbone' },
  { city: 'Mumbai', position: [19.0760, 72.8777] as [number, number], label: 'NSOP Operator Base', density: 'high', type: 'Backbone' },
  { city: 'Hyderabad', position: [17.3850, 78.4867] as [number, number], label: 'NSOP Operator Base', density: 'medium', type: 'Base' },
  { city: 'Chennai', position: [13.0827, 80.2707] as [number, number], label: 'NSOP Operator Base', density: 'medium', type: 'Base' },
  { city: 'Bengaluru', position: [12.9716, 77.5946] as [number, number], label: 'NSOP Operator Base', density: 'medium', type: 'Base' },
  { city: 'Kolkata', position: [22.5726, 88.3639] as [number, number], label: 'NSOP Operator Base', density: 'low', type: 'Base' },
];

// --- DEMAND ZONES DATA ---
const demandZones = [
    { city: 'Delhi', pos: [28.6139, 77.2090], level: 'High', color: '#00ffa6', radius: 150000, opacity: 0.35, prediction: '45-60', routes: 'Mumbai, London, Dubai' },
    { city: 'Mumbai', pos: [19.0760, 72.8777], level: 'High', color: '#00ffa6', radius: 150000, opacity: 0.35, prediction: '55-75', routes: 'Delhi, Bengaluru, Goa' },
    { city: 'Bengaluru', pos: [12.9716, 77.5946], level: 'Medium', color: '#0ea5e9', radius: 120000, opacity: 0.25, prediction: '30-42', routes: 'Hyderabad, Chennai, Mumbai' },
    { city: 'Hyderabad', pos: [17.3850, 78.4867], level: 'Medium', color: '#0ea5e9', radius: 120000, opacity: 0.25, prediction: '25-35', routes: 'Bengaluru, Delhi, Mumbai' },
    { city: 'Chennai', pos: [13.0827, 80.2707], level: 'Medium', color: '#0ea5e9', radius: 120000, opacity: 0.25, prediction: '20-28', routes: 'Bengaluru, Kolkata, Colombo' },
    { city: 'Goa', pos: [15.2993, 74.1240], level: 'Emerging', color: '#ffd166', radius: 90000, opacity: 0.18, prediction: '18-25', routes: 'Mumbai, Bengaluru' },
    { city: 'Jaipur', pos: [26.9124, 75.7873], level: 'Emerging', color: '#ffd166', radius: 90000, opacity: 0.18, prediction: '12-20', routes: 'Delhi, Ahmedabad' },
    { city: 'Ahmedabad', pos: [23.0225, 72.5714], level: 'Emerging', color: '#ffd166', radius: 90000, opacity: 0.18, prediction: '15-22', routes: 'Delhi, Mumbai' },
];

const predictedCorridors = [
    { from: [28.6139, 77.2090], to: [26.9124, 75.7873], label: 'Delhi → Jaipur' },
    { from: [19.0760, 72.8777], to: [15.2993, 74.1240], label: 'Mumbai → Goa' },
    { from: [12.9716, 77.5946], to: [17.3850, 78.4867], label: 'Bengaluru → Hyderabad' },
    { from: [28.6139, 77.2090], to: [23.0225, 72.5714], label: 'Delhi → Ahmedabad' },
    { from: [19.0760, 72.8777], to: [12.9716, 77.5946], label: 'Mumbai → Bengaluru' },
];

// --- STATUS CONFIG ---
type CharterStatus = 'Scheduled' | 'Boarding' | 'Airborne' | 'Completed';

const statusConfig: Record<CharterStatus, { color: string; label: string }> = {
  Airborne: { color: '#00ffa6', label: 'Airborne' },
  Boarding: { color: '#ffd166', label: 'Boarding' },
  Scheduled: { color: '#8b9bb0', label: 'Scheduled' },
  Completed: { color: '#bfc7d5', label: 'Completed' },
};

// --- SIMULATED FLIGHT DATA ---
const simulatedFlightsInitial = [
  { id: 'ADX-204', from: 'Delhi', to: 'Mumbai', aircraft: 'Citation XLS+', pax: 6, status: 'Airborne' as CharterStatus },
  { id: 'ADX-312', from: 'Mumbai', to: 'Bengaluru', aircraft: 'Global 6000', pax: 12, status: 'Boarding' as CharterStatus },
  { id: 'ADX-105', from: 'Bengaluru', to: 'Chennai', aircraft: 'Phenom 300', pax: 4, status: 'Scheduled' as CharterStatus },
  { id: 'ADX-440', from: 'Hyderabad', to: 'Mumbai', aircraft: 'Falcon 2000', pax: 8, status: 'Airborne' as CharterStatus },
  { id: 'ADX-098', from: 'Kolkata', to: 'Delhi', aircraft: 'Legacy 650', pax: 10, status: 'Completed' as CharterStatus },
  { id: 'ADX-552', from: 'Chennai', to: 'Hyderabad', aircraft: 'King Air B200', pax: 5, status: 'Airborne' as CharterStatus },
];

// --- BEZIER CURVE HELPER ---
function getBezierPoints(start: [number, number], end: [number, number], segments = 80) {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const distLat = end[0] - start[0];
  const distLng = end[1] - start[1];
  const controlLat = midLat - distLng * 0.15;
  const controlLng = midLng + distLat * 0.15;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = (1 - t) ** 2 * start[0] + 2 * (1 - t) * t * controlLat + t ** 2 * end[0];
    const lng = (1 - t) ** 2 * start[1] + 2 * (1 - t) * t * controlLng + t ** 2 * end[1];
    points.push([lat, lng]);
  }
  return points;
}

function getHeading(start: [number, number], end: [number, number]) {
    const dy = end[0] - start[0];
    const dx = end[1] - start[1];
    let theta = Math.atan2(dy, dx);
    theta *= 180 / Math.PI;
    return 90 - theta;
}

const AircraftMarker = ({ flight, points }: { flight: typeof simulatedFlightsInitial[0], points: [number, number][] }) => {
  const [index, setIndex] = useState(0);
  const totalPoints = points.length;
  const config = statusConfig[flight.status];

  useEffect(() => {
    if (flight.status !== 'Airborne') return;
    
    const speed = Math.random() * 100 + 150;
    const interval = setInterval(() => {
      setIndex((prev) => (prev >= totalPoints - 1 ? 0 : prev + 1));
    }, speed);
    return () => clearInterval(interval);
  }, [totalPoints, flight.status]);

  const currentPos = flight.status === 'Airborne' ? points[index] : 
                   flight.status === 'Completed' ? points[totalPoints - 1] : 
                   points[0];

  const nextPos = points[index + 1] || points[0];
  const heading = flight.status === 'Airborne' ? getHeading(currentPos, nextPos) : 0;

  const iconHtml = `
    <div class="aircraft-beacon ${flight.status.toLowerCase()}" style="transform: rotate(${heading}deg); color: ${config.color}">
      <span class="aircraft-icon">✈</span>
      <div class="status-glow" style="background: ${config.color}40"></div>
    </div>
  `;

  const aircraftIcon = L.divIcon({
    className: 'custom-div-icon',
    html: iconHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  if (flight.status === 'Completed') return null;

  return (
    <Marker position={currentPos} icon={aircraftIcon}>
      <Tooltip direction="top" offset={[0, -10]} className="ops-tooltip">
        <div className="p-2 space-y-1.5 min-w-[140px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-1">
            <span className="text-[10px] font-black text-accent">{flight.id}</span>
            <span className="text-[8px] font-bold uppercase px-1 rounded bg-white/10" style={{ color: config.color }}>{flight.status}</span>
          </div>
          <div className="text-[10px] space-y-0.5">
            <p className="text-white font-bold">{flight.from} → {flight.to}</p>
            <p className="text-muted-foreground">{flight.aircraft} • {flight.pax} PAX</p>
            <p className="text-[8px] text-muted-foreground uppercase tracking-tighter">Verified NSOP Partner</p>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

const RadarSweep = () => {
    const radarIcon = L.divIcon({
        className: 'radar-sweep-icon',
        html: `<div class="radar-beam"></div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
    return <Marker position={[21.1458, 79.0882]} icon={radarIcon} interactive={false} />;
};

const createRadarNodeIcon = (type: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="radar-node ${type === 'Backbone' ? 'backbone' : ''}">
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
  const [flights, setFlights] = useState(simulatedFlightsInitial);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const interval = setInterval(() => {
      setFlights(prev => prev.map(f => {
        if (f.status === 'Scheduled') return { ...f, status: 'Boarding' };
        if (f.status === 'Boarding') return { ...f, status: 'Airborne' };
        if (f.status === 'Airborne' && Math.random() > 0.8) return { ...f, status: 'Completed' };
        if (f.status === 'Completed') return { ...f, status: 'Scheduled' };
        return f;
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-4">
      {/* Forecasting Control Toggle */}
      <div className="flex items-center justify-between bg-[#0B1220]/60 backdrop-blur-md border border-white/5 p-3 rounded-2xl">
        <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg transition-colors", showForecast ? "bg-accent/20" : "bg-white/5")}>
                <Zap className={cn("h-4 w-4 transition-colors", showForecast ? "text-accent animate-pulse" : "text-muted-foreground")} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Market Intelligence Layer</p>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">AI Demand Forecasting active</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mr-2">Status:</span>
            <Button 
                variant={showForecast ? "accent" : "outline"} 
                size="sm" 
                onClick={() => setShowForecast(!showForecast)}
                className="h-8 text-[9px] font-black uppercase tracking-[0.2em] px-4 transition-all"
            >
                {showForecast ? "FORECAST ON" : "FORECAST OFF"}
            </Button>
        </div>
      </div>

      <div className="w-full h-[600px] relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#061122]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.1),transparent_70%)]" />
        
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

          <RadarSweep />

          {/* DEMAND FORECAST LAYER */}
          {showForecast && (
              <>
                {demandZones.map((zone) => (
                    <Circle
                        key={zone.city}
                        center={zone.pos as [number, number]}
                        radius={zone.radius}
                        pathOptions={{
                            fillColor: zone.color,
                            fillOpacity: zone.opacity,
                            color: zone.color,
                            weight: 1,
                            dashArray: '5, 5',
                            className: 'demand-pulse-circle'
                        }}
                    >
                        <Tooltip direction="top" className="ops-tooltip">
                            <div className="p-2 space-y-2 min-w-[180px]">
                                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Demand Forecast</span>
                                    <Badge className="bg-white/10 text-[8px] uppercase">{zone.level}</Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-xs font-bold text-white">{zone.city} Sector</p>
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-muted-foreground">Predicted Vol:</span>
                                        <span className="text-accent font-black">{zone.prediction} / Mo</span>
                                    </div>
                                    <div className="pt-1 border-t border-white/5">
                                        <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mb-1">Primary Corridors</p>
                                        <p className="text-[9px] text-white/80 italic">{zone.routes}</p>
                                    </div>
                                </div>
                            </div>
                        </Tooltip>
                    </Circle>
                ))}
                {predictedCorridors.map((route, i) => (
                    <Polyline
                        key={`pred-${i}`}
                        positions={[route.from as [number, number], route.to as [number, number]]}
                        pathOptions={{
                            color: '#ffd166',
                            weight: 1.5,
                            opacity: 0.35,
                            dashArray: '4, 8'
                        }}
                    />
                ))}
              </>
          )}

          {/* ACTIVE MISSION LAYERS */}
          {flights.map((flight) => {
            const fromNode = hubNodes.find(h => h.city === flight.from);
            const toNode = hubNodes.find(h => h.city === flight.to);
            if (!fromNode || !toNode) return null;

            const points = getBezierPoints(fromNode.position, toNode.position);
            const config = statusConfig[flight.status];

            return (
              <React.Fragment key={flight.id}>
                <Polyline
                  positions={points}
                  pathOptions={{
                    color: config.color,
                    weight: 1,
                    opacity: flight.status === 'Airborne' ? 0.4 : 0.1,
                    dashArray: flight.status === 'Airborne' ? '4, 8' : '2, 10',
                  }}
                />
                <AircraftMarker flight={flight} points={points} />
              </React.Fragment>
            );
          })}

          {/* HUB INFRASTRUCTURE */}
          {hubNodes.map((hub) => (
            <Marker
              key={hub.city}
              position={hub.position}
              icon={createRadarNodeIcon(hub.type)}
            >
              <Tooltip direction="top" offset={[0, -10]} className="ops-tooltip">
                <div className="p-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-0">{hub.city} HUB</p>
                  <p className="text-[9px] text-white/60 font-bold mt-0">{hub.label}</p>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* OPERATIONS LEGEND */}
        <div className="absolute bottom-6 right-6 z-20 bg-[#0B1220]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl pointer-events-none animate-in fade-in slide-in-from-bottom-2">
          <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 border-b border-white/5 pb-2">
            Operations Panel
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ffa6] shadow-[0_0_8px_#00ffa6]" />
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Live Mission</span>
            </div>
            {showForecast && (
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ffd166] shadow-[0_0_8px_#ffd166] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#ffd166] uppercase tracking-tighter">Demand Signal</span>
                </div>
            )}
            <div className="flex items-center gap-3 opacity-50">
                <div className="w-2 h-2 rounded-full bg-[#8b9bb0]" />
                <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Scheduled</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-20 bg-[#061122]/50 pointer-events-none" />

        <style jsx global>{`
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
          .radar-node.backbone .node-core {
            background-color: #ffd166;
            box-shadow: 0 0 12px #ffd166;
          }
          .radar-pulse {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 255, 166, 0.15);
            border-radius: 50%;
            animation: pulse-node 2.5s infinite ease-out;
            z-index: 1;
          }
          @keyframes pulse-node {
            0% { transform: scale(0.2); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }

          .demand-pulse-circle {
              animation: demand-pulse 6s infinite ease-in-out;
              transform-origin: center;
          }
          @keyframes demand-pulse {
              0%, 100% { transform: scale(1.0); fill-opacity: 0.2; }
              50% { transform: scale(1.15); fill-opacity: 0.4; }
          }

          .aircraft-beacon {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            transition: opacity 0.5s ease;
          }
          .aircraft-icon {
            font-size: 18px;
            text-shadow: 0 0 10px currentColor;
            z-index: 10;
          }
          .status-glow {
            position: absolute;
            width: 12px;
            height: 12px;
            filter: blur(6px);
            border-radius: 50%;
          }
          
          .aircraft-beacon.boarding .aircraft-icon {
            animation: boarding-pulse 1.5s infinite ease-in-out;
          }
          @keyframes boarding-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.6; }
          }

          .radar-sweep-icon { width: 0 !important; height: 0 !important; }
          .radar-beam {
              position: absolute;
              width: 800px;
              height: 800px;
              background: conic-gradient(from 0deg, rgba(0, 255, 166, 0.1) 0deg, transparent 60deg);
              border-radius: 50%;
              transform-origin: center;
              animation: radar-rotate 6s linear infinite;
              top: -400px;
              left: -400px;
              pointer-events: none;
          }
          @keyframes radar-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }

          .leaflet-container { background: transparent !important; }
          .ops-tooltip {
            background: rgba(11, 18, 32, 0.95) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
            backdrop-filter: blur(12px);
            color: white !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
          }
          .custom-div-icon { background: transparent !important; border: none !important; }
        `}</style>
      </div>
    </div>
  );
}
