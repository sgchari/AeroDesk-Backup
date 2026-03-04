
'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, Activity, Coins, Plane, Info } from 'lucide-react';

// Use a placeholder if token is not in env
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGV2ZWxvcGVyLWFpIiwiYSI6ImNtNnhwaGNuejAwenIycXB2NXNhdTFnbTkifQ.v_clZ_CL_Z_CL_Z_CL_Z_Q';

// --- HUB NODES ---
const hubNodes = [
  { city: 'Delhi', position: [77.2090, 28.6139] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Mumbai', position: [72.8777, 19.0760] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Hyderabad', position: [78.4867, 17.3850] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Chennai', position: [80.2707, 13.0827] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Bangalore', position: [77.5946, 12.9716] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Kolkata', position: [88.3639, 22.5726] as [number, number], label: 'NSOP Operator Base' },
];

// --- DEMAND HEATMAP DATA ---
const demandHeatmapPoints = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { weight: 0.9 }, geometry: { type: 'Point', coordinates: [77.2090, 28.6139] } },
    { type: 'Feature', properties: { weight: 0.8 }, geometry: { type: 'Point', coordinates: [72.8777, 19.0760] } },
    { type: 'Feature', properties: { weight: 0.6 }, geometry: { type: 'Point', coordinates: [77.5946, 12.9716] } },
    { type: 'Feature', properties: { weight: 0.5 }, geometry: { type: 'Point', coordinates: [78.4867, 17.3850] } },
    { type: 'Feature', properties: { weight: 0.4 }, geometry: { type: 'Point', coordinates: [80.2707, 13.0827] } },
    { type: 'Feature', properties: { weight: 0.3 }, geometry: { type: 'Point', coordinates: [88.3639, 22.5726] } },
    { type: 'Feature', properties: { weight: 0.7 }, geometry: { type: 'Point', coordinates: [74.1240, 15.2993] } },
    { type: 'Feature', properties: { weight: 0.5 }, geometry: { type: 'Point', coordinates: [75.7873, 26.9124] } },
  ]
};

// --- BEZIER & BEARING HELPERS ---
function getBearing(startLat: number, startLng: number, endLat: number, endLng: number) {
  const dLon = (endLng - startLng) * Math.PI / 180;
  const lat1 = startLat * Math.PI / 180;
  const lat2 = endLat * Math.PI / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const brng = Math.atan2(y, x);
  return ((brng * 180 / Math.PI) + 360) % 360;
}

function getBezierPoints(start: [number, number], end: [number, number], segments = 150) {
  const points: [number, number][] = [];
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  const offset = len * 0.15;
  const ctrlX = midX + nx * offset;
  const ctrlY = midY + ny * offset;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * ctrlX + t * t * end[0];
    const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * ctrlY + t * t * end[1];
    points.push([x, y]);
  }
  return points;
}

// --- MISSION CONFIG ---
const ACTIVE_MISSIONS = [
  { id: 'ADX-204', from: hubNodes[0], to: hubNodes[1], color: '#00FFA6' },
  { id: 'ADX-312', from: hubNodes[1], to: hubNodes[4], color: '#00FFA6' },
  { id: 'ADX-440', from: hubNodes[2], to: hubNodes[0], color: '#00FFA6' },
  { id: 'ADX-505', from: hubNodes[5], to: hubNodes[3], color: '#00FFA6' },
];

const EMPTY_LEGS = [
  { id: 'EL-001', from: hubNodes[1], to: [74.1240, 15.2993] as [number, number], color: '#FFD166' },
  { id: 'EL-002', from: hubNodes[0], to: [75.7873, 26.9124] as [number, number], color: '#FFD166' },
];

export function IndiaOperatorNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [showEmptyLegs, setShowEmptyLegs] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: [78.9629, 22.5937],
      zoom: 4.2,
      attributionControl: false,
      scrollZoom: false,
      dragPan: true,
    });

    map.current.on('style.load', () => {
      if (!map.current) return;

      // Apply Institutional Navy Palette
      const style = map.current.getStyle();
      if (style && style.layers) {
        style.layers.forEach((layer) => {
          if (layer.id === 'background') map.current?.setPaintProperty(layer.id, 'background-color', '#0B1F33');
          if (layer.id.includes('water')) map.current?.setPaintProperty(layer.id, 'fill-color', '#081622');
          if (layer.id.includes('admin') && layer.type === 'line') map.current?.setPaintProperty(layer.id, 'line-color', '#1E3A5F');
          if (layer.type === 'symbol') map.current?.setPaintProperty(layer.id, 'text-opacity', 0.35);
        });
      }

      // Add NSOP Operator Hubs (Radar Nodes)
      hubNodes.forEach(hub => {
        const el = document.createElement('div');
        el.className = 'radar-node-container';
        el.innerHTML = `
          <div class="radar-node-pulse"></div>
          <div class="radar-node-core"></div>
        `;
        
        new mapboxgl.Marker(el)
          .setLngLat(hub.position)
          .setPopup(new mapboxgl.Popup({ className: 'ops-popup' }).setHTML(`<p class="text-[10px] font-black uppercase tracking-widest text-accent">${hub.city}</p><p class="text-[8px] text-white/60">${hub.label}</p>`))
          .addTo(map.current!);
      });

      // Initialize Demand Forecast Layer
      map.current.addSource('demand-forecast', { type: 'geojson', data: demandHeatmapPoints });
      map.current.addLayer({
        id: 'demand-heat',
        type: 'heatmap',
        source: 'demand-forecast',
        layout: { visibility: 'none' },
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(42, 127, 255, 0)',
            0.2, '#2A7FFF',
            0.5, '#00FFA6',
            0.8, '#FFD166'
          ],
          'heatmap-radius': 40,
          'heatmap-opacity': 0.35
        }
      });

      // Animate Aircraft Telemetry
      ACTIVE_MISSIONS.forEach(mission => {
        animateMission(mission, map.current!);
      });
    });

    return () => map.current?.remove();
  }, []);

  const animateMission = (mission: any, mapInstance: mapboxgl.Map) => {
    const points = getBezierPoints(mission.from.position, mission.to.position || mission.to);
    let step = 0;

    // Route Path Layer
    const routeId = `route-${mission.id}`;
    mapInstance.addSource(routeId, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: points }, properties: {} }
    });
    mapInstance.addLayer({
      id: routeId,
      type: 'line',
      source: routeId,
      paint: { 'line-color': mission.color, 'line-width': 2, 'line-dasharray': [4, 6], 'line-opacity': 0.7 }
    });

    // Aircraft Marker
    const planeEl = document.createElement('div');
    planeEl.className = 'aircraft-marker';
    planeEl.innerHTML = `<span style="font-size: 18px; color: ${mission.color}; display: block; filter: drop-shadow(0 0 8px ${mission.color}99);">✈</span>`;
    
    const marker = new mapboxgl.Marker(planeEl)
      .setLngLat(points[0])
      .addTo(mapInstance);

    const stepAnimation = () => {
      if (!map.current) return;
      step = (step + 1) % points.length;
      const current = points[step];
      const next = points[(step + 1) % points.length];
      
      const bearing = getBearing(current[1], current[0], next[1], next[0]);
      marker.setLngLat(current);
      marker.setRotation(bearing);

      requestAnimationFrame(stepAnimation);
    };

    requestAnimationFrame(stepAnimation);
  };

  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    map.current.setLayoutProperty('demand-heat', 'visibility', showForecast ? 'visible' : 'none');
  }, [showForecast]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col gap-4">
      {/* Simulation Controls */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Demand Forecast Layer</p>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">Predictive Market Intensity</p>
            </div>
            <Button 
              size="sm" 
              variant={showForecast ? "accent" : "outline"} 
              onClick={() => setShowForecast(!showForecast)}
              className="h-7 text-[8px] font-black uppercase px-3"
            >
              {showForecast ? "ON" : "OFF"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Empty Leg Layer</p>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">Repositioning Opportunities</p>
            </div>
            <Button 
              size="sm" 
              variant={showEmptyLegs ? "accent" : "outline"} 
              onClick={() => setShowEmptyLegs(!showEmptyLegs)}
              className={cn("h-7 text-[8px] font-black uppercase px-3", showEmptyLegs && "bg-[#FFD166] text-black border-none hover:bg-[#FFD166]/90")}
            >
              {showEmptyLegs ? "ON" : "OFF"}
            </Button>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-full rounded-3xl border border-white/5 shadow-2xl bg-[#061122]" />

      {/* Legend Panel */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 border-b border-white/5 pb-2">Institutional Legend</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FFA6] shadow-[0_0_8px_#00FFA6]" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Active Charter</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full border border-[#00FFA6] animate-ping" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Operator Base</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />
            <span className="text-[9px] font-bold text-[#FFD166] uppercase tracking-tighter">Empty Leg Opportunity</span>
          </div>
          <div className="flex items-center gap-3 opacity-60">
            <div className="w-2 h-2 rounded bg-gradient-to-r from-[#2A7FFF] to-[#FFD166]" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Demand Forecast</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .radar-node-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radar-node-core {
          width: 6px;
          height: 6px;
          background: #00FFA6;
          border-radius: 50%;
          box-shadow: 0 0 10px #00FFA6;
          z-index: 2;
        }
        .radar-node-pulse {
          position: absolute;
          width: 28px;
          height: 28px;
          border: 2px solid #00FFA6;
          border-radius: 50%;
          animation: radar-pulse 2.5s infinite;
          z-index: 1;
        }
        @keyframes radar-pulse {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .aircraft-marker {
          transition: transform 0.1s linear;
          animation: aircraft-blink 1.5s step-start infinite;
        }
        @keyframes aircraft-blink {
          50% { opacity: 0.6; }
        }
        .ops-popup .mapboxgl-popup-content {
          background: rgba(11, 18, 32, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(12px);
          padding: 8px 12px;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .ops-popup .mapboxgl-popup-tip {
          border-top-color: rgba(11, 18, 32, 0.95);
        }
      `}</style>
    </div>
  );
}
