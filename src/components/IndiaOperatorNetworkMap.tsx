
'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, X, Plane, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- INSTITUTIONAL HUB DATA (Lng, Lat) ---
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

const ACTIVE_MISSIONS_CONFIG = [
  { id: 'ADX-101', from: [77.1025, 28.7041], to: [72.8777, 19.0760] }, // Delhi to Mumbai
  { id: 'ADX-102', from: [72.8777, 19.0760], to: [77.5946, 12.9716] }, // Mumbai to Bangalore
  { id: 'ADX-103', from: [77.5946, 12.9716], to: [80.2707, 13.0827] }, // Bangalore to Chennai
  { id: 'ADX-104', from: [80.2707, 13.0827], to: [78.4867, 17.3850] }, // Chennai to Hyderabad
  { id: 'ADX-105', from: [78.4867, 17.3850], to: [77.1025, 28.7041] }, // Hyderabad to Delhi
  { id: 'ADX-106', from: [88.3639, 22.5726], to: [77.1025, 28.7041] }, // Kolkata to Delhi
];

const demandHeatmapPoints = {
  type: 'FeatureCollection',
  features: hubNodes.map(hub => ({
    type: 'Feature',
    properties: { weight: Math.random() },
    geometry: { type: 'Point', coordinates: hub.position }
  }))
};

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
      maxZoom: 8,
      attributionControl: false,
      scrollZoom: false,
      dragPan: true,
      maxBounds: [[60, 5], [100, 35]]
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // --- APPLY INSTITUTIONAL PALETTE ---
      const style = map.current.getStyle();
      style.layers?.forEach((layer) => {
        if (layer.type === 'background') {
          map.current?.setPaintProperty(layer.id, 'background-color', '#0B1F33');
        } else if (layer.type === 'fill' && (layer.id.includes('water') || layer.id.includes('ocean'))) {
          map.current?.setPaintProperty(layer.id, 'fill-color', '#081622');
        } else if (layer.type === 'line' && (layer.id.includes('admin') || layer.id.includes('boundary'))) {
          map.current?.setPaintProperty(layer.id, 'line-color', '#1E3A5F');
        } else if (layer.type === 'symbol' && layer.id.includes('place')) {
          map.current?.setPaintProperty(layer.id, 'text-opacity', 0.35);
        }
      });

      // --- HUB RADAR NODES ---
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
      map.current.addSource('demand-forecast', { type: 'geojson', data: demandHeatmapPoints as any });
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

      // --- MISSION TELEMETRY ---
      ACTIVE_MISSIONS_CONFIG.forEach((mission, index) => {
        // Stagger spawn times
        setTimeout(() => {
          if (map.current) animateMission(mission, map.current);
        }, index * 2000);
      });
    });

    return () => map.current?.remove();
  }, []);

  const animateMission = (mission: any, mapInstance: maplibregl.Map) => {
    const startPoint = turf.point(mission.from);
    const endPoint = turf.point(mission.to);
    const options = { units: 'kilometers' as const };
    const routeDistance = turf.distance(startPoint, endPoint, options);
    const routeLine = turf.greatCircle(startPoint, endPoint, { npoints: 500 });
    const routeCoords = routeLine.geometry.coordinates;

    // Trail Source
    const sourceId = `trail-${mission.id}`;
    mapInstance.addSource(sourceId, {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} }
    });

    mapInstance.addLayer({
      id: `${sourceId}-layer`,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#00FFA6',
        'line-width': 2,
        'line-opacity': 0.6,
        'line-dasharray': [2, 2]
      },
      layout: { 'line-cap': 'round', 'line-join': 'round' }
    });

    // Aircraft Marker
    const planeEl = document.createElement('div');
    planeEl.className = 'aircraft-marker';
    planeEl.innerHTML = `
      <svg viewBox="0 0 24 24" fill="#00FFA6" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    `;
    
    const marker = new maplibregl.Marker({ element: planeEl, rotationAlignment: 'map' })
      .setLngLat(mission.from)
      .addTo(mapInstance);

    let progress = 0;
    const speed = 0.0008; // Units per frame

    function step() {
      if (!map.current) return;

      progress += speed;
      if (progress > 1) progress = 0;

      const currentAlong = turf.along(routeLine, progress * routeDistance, options);
      const nextAlong = turf.along(routeLine, Math.min(1, progress + 0.01) * routeDistance, options);
      const bearing = turf.bearing(currentAlong, nextAlong);

      marker.setLngLat(currentAlong.geometry.coordinates as [number, number]);
      marker.setRotation(bearing);

      // Contrail Update: Last 10% of coordinates
      const currentIdx = Math.floor(progress * routeCoords.length);
      const trailStartIdx = Math.max(0, currentIdx - 40);
      const trailCoords = routeCoords.slice(trailStartIdx, currentIdx + 1);

      const source = mapInstance.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: trailCoords },
          properties: {}
        });
      }

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;
    map.current.setLayoutProperty('demand-heat', 'visibility', showForecast ? 'visible' : 'none');
  }, [showForecast]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col gap-4">
      {/* --- LAYER CONTROLS --- */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Demand Forecast</p>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">Predictive Intensity</p>
            </div>
            <Button 
              size="sm" 
              variant={showForecast ? "default" : "outline"} 
              onClick={() => setShowForecast(!showForecast)}
              className={cn("h-7 text-[8px] font-black uppercase px-3", showForecast && "bg-primary text-white border-none")}
            >
              {showForecast ? "ON" : "OFF"}
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
                        <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Aircraft Types</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedHub.aircraft.map(ac => (
                                <Badge key={ac} variant="outline" className="text-[7px] border-white/10 bg-white/5 text-white/70 h-4 px-1.5">{ac}</Badge>
                            ))}
                        </div>
                    </div>
                    <Button className="w-full h-8 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-accent/10">
                        Available Charters <ArrowRight className="h-3 w-3" />
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
        </div>
      </div>

      <style jsx global>{`
        .radar-node-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
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
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 12px #00FFA6);
          transition: transform 0.1s linear;
        }
        .aircraft-marker svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
