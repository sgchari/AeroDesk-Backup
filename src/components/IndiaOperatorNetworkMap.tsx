
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ShieldCheck, Activity, Plane, Info, X, MapPin, Gavel, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- INSTITUTIONAL HUB DATA ---
const hubNodes = [
  { 
    id: 'hub-delhi',
    city: 'Delhi', 
    position: [77.1025, 28.7041] as [number, number], 
    operators: 4, 
    aircraft: ['Global 6000', 'Falcon 2000', 'Citation XLS'],
    emptyLegs: 3,
    status: 'High Availability'
  },
  { 
    id: 'hub-mumbai',
    city: 'Mumbai', 
    position: [72.8777, 19.0760] as [number, number], 
    operators: 5, 
    aircraft: ['Legacy 650', 'Challenger 350', 'King Air B200'],
    emptyLegs: 2,
    status: 'Optimal'
  },
  { 
    id: 'hub-hyderabad',
    city: 'Hyderabad', 
    position: [78.4867, 17.3850] as [number, number], 
    operators: 2, 
    aircraft: ['Phenom 300', 'Pilatus PC-12'],
    emptyLegs: 1,
    status: 'Standby'
  },
  { 
    id: 'hub-bangalore',
    city: 'Bangalore', 
    position: [77.5946, 12.9716] as [number, number], 
    operators: 3, 
    aircraft: ['Citation CJ4', 'Hawker 800XP'],
    emptyLegs: 4,
    status: 'High Demand'
  },
  { 
    id: 'hub-chennai',
    city: 'Chennai', 
    position: [80.2707, 13.0827] as [number, number], 
    operators: 2, 
    aircraft: ['King Air C90', 'Bell 429'],
    emptyLegs: 0,
    status: 'Limited'
  },
  { 
    id: 'hub-kolkata',
    city: 'Kolkata', 
    position: [88.3639, 22.5726] as [number, number], 
    operators: 2, 
    aircraft: ['Dornier 228', 'Citation XLS'],
    emptyLegs: 1,
    status: 'Regional Focus'
  },
];

// --- DEMAND HEATMAP DATA ---
const demandHeatmapPoints = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { weight: 0.9 }, geometry: { type: 'Point', coordinates: [77.1025, 28.7041] } },
    { type: 'Feature', properties: { weight: 0.8 }, geometry: { type: 'Point', coordinates: [72.8777, 19.0760] } },
    { type: 'Feature', properties: { weight: 0.6 }, geometry: { type: 'Point', coordinates: [77.5946, 12.9716] } },
    { type: 'Feature', properties: { weight: 0.7 }, geometry: { type: 'Point', coordinates: [74.1240, 15.2993] } },
    { type: 'Feature', properties: { weight: 0.5 }, geometry: { type: 'Point', coordinates: [75.7873, 26.9124] } },
  ]
};

// --- EMPTY LEG DATA ---
const emptyLegPoints = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'EL-99', type: 'Empty Leg Opportunity' }, geometry: { type: 'Point', coordinates: [74.1240, 15.2993] } },
    { type: 'Feature', properties: { id: 'EL-102', type: 'Empty Leg Opportunity' }, geometry: { type: 'Point', coordinates: [75.7873, 26.9124] } },
    { type: 'Feature', properties: { id: 'EL-105', type: 'Empty Leg Opportunity' }, geometry: { type: 'Point', coordinates: [78.0421, 27.1767] } },
  ]
};

// --- BEARING CALCULATION ---
function getBearing(start: [number, number], end: [number, number]) {
  const startLat = start[1] * Math.PI / 180;
  const startLng = start[0] * Math.PI / 180;
  const endLat = end[1] * Math.PI / 180;
  const endLng = end[0] * Math.PI / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  const bearing = Math.atan2(y, x);
  return (bearing * 180 / Math.PI + 360) % 360;
}

// --- MISSION CONFIG ---
const ACTIVE_MISSIONS = [
  { id: 'ADX-204', from: hubNodes[0].position, to: hubNodes[1].position, color: '#00FFA6' },
  { id: 'ADX-312', from: hubNodes[1].position, to: hubNodes[3].position, color: '#00FFA6' },
  { id: 'ADX-440', from: hubNodes[2].position, to: hubNodes[0].position, color: '#00FFA6' },
  { id: 'ADX-505', from: hubNodes[5].position, to: hubNodes[4].position, color: '#00FFA6' },
];

export function IndiaOperatorNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [showEmptyLegs, setShowEmptyLegs] = useState(false);
  const [selectedHub, setSelectedHub] = useState<typeof hubNodes[0] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [79, 21],
      zoom: 4.7,
      minZoom: 4,
      maxZoom: 10,
      attributionControl: false,
      scrollZoom: false,
      dragPan: true,
      maxBounds: [[60, 5], [100, 40]] // Restrict to South Asia
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // --- APPLY INSTITUTIONAL PALETTE ---
      const layers = map.current.getStyle().layers;
      layers?.forEach((layer) => {
        if (layer.type === 'background') {
          map.current?.setPaintProperty(layer.id, 'background-color', '#0B1F33');
        } else if (layer.type === 'fill' && layer.id.includes('water')) {
          map.current?.setPaintProperty(layer.id, 'fill-color', '#081622');
        } else if (layer.type === 'line' && (layer.id.includes('admin') || layer.id.includes('boundary'))) {
          map.current?.setPaintProperty(layer.id, 'line-color', '#1E3A5F');
        } else if (layer.type === 'symbol' && layer.id.includes('place')) {
          map.current?.setPaintProperty(layer.id, 'text-opacity', 0.35);
        }
      });

      // --- RADAR NODES (OPERATOR BASES) ---
      hubNodes.forEach(hub => {
        const el = document.createElement('div');
        el.className = 'radar-node-container';
        el.innerHTML = `
          <div class="radar-node-pulse"></div>
          <div class="radar-node-core"></div>
        `;
        
        el.onclick = (e) => {
            e.stopPropagation();
            setSelectedHub(hub);
        };
        
        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(hub.position)
          .addTo(map.current!);
      });

      // --- INTELLIGENCE LAYERS ---
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
      }, 'hub-delhi'); // Render below hubs

      map.current.addSource('empty-legs', { type: 'geojson', data: emptyLegPoints });
      map.current.addLayer({
        id: 'empty-leg-nodes',
        type: 'circle',
        source: 'empty-legs',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': 6,
          'circle-color': '#FFD166',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0B1F33'
        }
      });

      // --- ANIMATE MISSIONS ---
      ACTIVE_MISSIONS.forEach(mission => {
        animateMission(mission, map.current!);
      });
    });

    return () => map.current?.remove();
  }, []);

  const animateMission = (mission: any, mapInstance: maplibregl.Map) => {
    const start = mission.from;
    const end = mission.to;
    
    // Generate Great-Circle Arc
    const arc = turf.greatCircle(turf.point(start), turf.point(end), { npoints: 300 });
    const points = arc.geometry.coordinates as [number, number][];
    
    let step = 0;

    const routeId = `route-${mission.id}`;
    mapInstance.addSource(routeId, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: points }, properties: {} }
    });
    
    mapInstance.addLayer({
      id: routeId,
      type: 'line',
      source: routeId,
      paint: { 
        'line-color': mission.color, 
        'line-width': 2, 
        'line-dasharray': [2, 3], 
        'line-opacity': 0.4 
      }
    });

    const trailId = `trail-${mission.id}`;
    mapInstance.addSource(trailId, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} }
    });
    mapInstance.addLayer({
      id: trailId,
      type: 'line',
      source: trailId,
      paint: { 
        'line-color': mission.color, 
        'line-width': 3, 
        'line-opacity': ['interpolate', ['linear'], ['line-progress'], 0, 0, 1, 0.8]
      } as any,
      layout: { 'line-cap': 'round', 'line-join': 'round' }
    });

    // Aircraft Marker with Zoom Scaling
    const planeEl = document.createElement('div');
    planeEl.className = 'aircraft-marker';
    planeEl.innerHTML = `
      <div class="aircraft-glow"></div>
      <div class="aircraft-icon">
        <svg viewBox="0 0 24 24" fill="${mission.color}" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `;
    
    const marker = new maplibregl.Marker({ element: planeEl, rotationAlignment: 'map' })
      .setLngLat(points[0])
      .addTo(mapInstance);

    const stepAnimation = () => {
      if (!map.current) return;
      
      step = (step + 1) % points.length;
      const current = points[step];
      const next = points[(step + 1) % points.length];
      
      // Update Trail
      const trailPoints = points.slice(Math.max(0, step - 40), step + 1);
      const trailSource = mapInstance.getSource(trailId) as maplibregl.GeoJSONSource;
      if (trailSource) {
        trailSource.setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: trailPoints },
          properties: {}
        });
      }
      
      // Update Position & Rotation
      const bearing = getBearing(current, next);
      marker.setLngLat(current);
      marker.setRotation(bearing);

      requestAnimationFrame(stepAnimation);
    };

    requestAnimationFrame(stepAnimation);
  };

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;
    map.current.setLayoutProperty('demand-heat', 'visibility', showForecast ? 'visible' : 'none');
  }, [showForecast]);

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;
    map.current.setLayoutProperty('empty-leg-nodes', 'visibility', showEmptyLegs ? 'visible' : 'none');
  }, [showEmptyLegs]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col gap-4">
      {/* --- LAYER CONTROLS --- */}
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

      {/* --- DISCOVERY PANEL --- */}
      {selectedHub && (
        <div className="absolute top-6 right-6 z-30 w-72 animate-in slide-in-from-right-4 duration-500">
            <Card className="bg-slate-950/90 backdrop-blur-2xl border-accent/20 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-white">{selectedHub.city} HUB</CardTitle>
                        <p className="text-[8px] text-accent uppercase font-bold">{selectedHub.status}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white" onClick={() => setSelectedHub(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Operators</p>
                            <p className="text-lg font-black text-white">{selectedHub.operators}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Empty Legs</p>
                            <p className="text-lg font-black text-[#FFD166]">{selectedHub.emptyLegs}</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Verified Aircraft Types</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedHub.aircraft.map(ac => (
                                <Badge key={ac} variant="outline" className="text-[7px] border-white/10 bg-white/5 text-white/70 h-4 px-1.5">{ac}</Badge>
                            ))}
                        </div>
                    </div>
                    <Button className="w-full h-8 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-accent/10">
                        View Available Charters <ArrowRight className="h-3 w-3" />
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}

      {/* --- MAP CONTAINER --- */}
      <div ref={mapContainer} className="w-full h-full rounded-3xl border border-white/5 shadow-2xl bg-[#061122]" />

      {/* --- LEGEND --- */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 border-b border-white/5 pb-2">Intelligence Legend</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FFA6] shadow-[0_0_8px_#00FFA6] animate-pulse" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Active Charter Mission</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full border border-[#00FFA6] animate-ping" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">NSOP Operator Base</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />
            <span className="text-[9px] font-bold text-[#FFD166] uppercase tracking-tighter">Empty Leg Discovery</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded bg-gradient-to-r from-[#2A7FFF] to-[#FFD166]" />
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">Demand Heatmap</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .radar-node-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
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
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: aircraft-pulse 1.5s ease-in-out infinite;
        }
        .aircraft-glow {
          position: absolute;
          width: 16px;
          height: 16px;
          background: radial-gradient(circle, #00FFA699 0%, transparent 70%);
          filter: blur(4px);
        }
        .aircraft-icon svg {
          width: 26px;
          height: 26px;
          filter: drop-shadow(0 0 4px #00FFA6);
        }
        @keyframes aircraft-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); opacity: 0.9; }
        }
        /* Zoom Scaling Simulation via CSS */
        .maplibregl-map[zoom^="1"], .maplibregl-map[zoom^="2"], .maplibregl-map[zoom^="3"] .aircraft-icon svg { width: 18px; height: 18px; }
        .maplibregl-map[zoom^="4"], .maplibregl-map[zoom^="5"], .maplibregl-map[zoom^="6"] .aircraft-icon svg { width: 26px; height: 26px; }
        .maplibregl-map[zoom^="7"], .maplibregl-map[zoom^="8"], .maplibregl-map[zoom^="9"] .aircraft-icon svg { width: 32px; height: 32px; }
      `}</style>
    </div>
  );
}
