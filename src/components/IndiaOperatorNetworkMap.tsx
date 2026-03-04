'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Zap, X, Plane, ArrowRight, ShieldCheck, 
    Activity, Target, Info, Coins, Clock, MapPin, 
    GanttChartSquare, Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// --- INSTITUTIONAL HUB DATA ---
const hubNodes = [
  { id: 'delhi', city: 'Delhi', position: [77.1025, 28.7041] as [number, number], operators: 4, aircraft: ['Citation XLS', 'Falcon 2000', 'Global 6000'], emptyLegs: 3, status: 'Optimal' },
  { id: 'mumbai', city: 'Mumbai', position: [72.8777, 19.0760] as [number, number], operators: 5, aircraft: ['Legacy 650', 'Challenger 350', 'King Air B200'], emptyLegs: 2, status: 'High Demand' },
  { id: 'hyderabad', city: 'Hyderabad', position: [78.4867, 17.3850] as [number, number], operators: 2, aircraft: ['Phenom 300', 'Pilatus PC-12'], emptyLegs: 1, status: 'Standby' },
  { id: 'bangalore', city: 'Bangalore', position: [77.5946, 12.9716] as [number, number], operators: 3, aircraft: ['Citation CJ4', 'Hawker 800XP'], emptyLegs: 4, status: 'Optimal' },
  { id: 'chennai', city: 'Chennai', position: [80.2707, 13.0827] as [number, number], operators: 2, aircraft: ['King Air C90', 'Bell 429'], emptyLegs: 0, status: 'Limited' },
  { id: 'kolkata', city: 'Kolkata', position: [88.3639, 22.5726] as [number, number], operators: 2, aircraft: ['Dornier 228', 'Citation XLS'], emptyLegs: 1, status: 'Regional Focus' }
];

const ACTIVE_MISSIONS_CONFIG = [
  { id: 'ADX-101', from: 'delhi', to: 'mumbai' },
  { id: 'ADX-102', from: 'mumbai', to: 'bangalore' },
  { id: 'ADX-103', from: 'bangalore', to: 'chennai' },
  { id: 'ADX-104', from: 'chennai', to: 'hyderabad' },
  { id: 'ADX-105', from: 'hyderabad', to: 'delhi' },
  { id: 'ADX-106', from: 'kolkata', to: 'delhi' }
];

const demandHeatmapPoints = {
  type: 'FeatureCollection',
  features: [
    ...hubNodes.map(hub => ({ type: 'Feature', properties: { weight: 0.8 }, geometry: { type: 'Point', coordinates: hub.position } })),
    { type: 'Feature', properties: { weight: 0.9 }, geometry: { type: 'Point', coordinates: [55.2708, 25.2048] } } // Dubai
  ]
};

export function IndiaOperatorNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [showEmptyLegs, setShowEmptyLegs] = useState(false);
  const [selectedHub, setSelectedHub] = useState<typeof hubNodes[0] | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<{from: string, to: string, distance: number} | null>(null);
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth < 1024;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      // Center and Zoom calibrated to show full India outline
      center: [78.9629, 23.5937],
      zoom: isMobile ? 3.5 : 4.3,
      minZoom: 3,
      maxZoom: 10,
      attributionControl: false,
      scrollZoom: false,
      dragPan: true,
      maxBounds: [[60, 5], [100, 38]]
    });

    map.current = mapInstance;

    const animateMission = (mission: any, instance: maplibregl.Map) => {
      if (!isMounted || !instance || (instance as any)._removed) return;

      const fromNode = hubNodes.find(h => h.id === mission.from);
      const toNode = hubNodes.find(h => h.id === mission.to);
      if (!fromNode || !toNode) return;

      const start = fromNode.position;
      const end = toNode.position;
      
      const routeLine = turf.greatCircle(turf.point(start), turf.point(end), { npoints: 300 });
      const routeCoords = routeLine.geometry.coordinates;
      const routeDistance = turf.distance(turf.point(start), turf.point(end));

      const sourceId = `trail-${mission.id}`;
      
      try {
        instance.addSource(sourceId, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} }
        });

        instance.addLayer({
          id: `${sourceId}-layer`,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#00FFA6',
            'line-width': 2,
            'line-opacity': 0.4,
            'line-dasharray': [4, 6]
          }
        });

        const planeEl = document.createElement('div');
        planeEl.className = 'aircraft-marker';
        planeEl.innerHTML = `
          <div class="aircraft-glow"></div>
          <svg viewBox="0 0 24 24" fill="#00FFA6" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        `;
        
        const marker = new maplibregl.Marker({ element: planeEl, rotationAlignment: 'map' })
          .setLngLat(start)
          .addTo(instance);

        let progress = Math.random(); 
        const speed = isMobile ? 0.0003 : 0.0005;
        let animationFrameId: number;

        const step = () => {
          if (!isMounted || (instance as any)._removed || !instance.style) {
            cancelAnimationFrame(animationFrameId);
            return;
          }

          progress += speed;
          if (progress > 1) progress = 0;

          const currentAlong = turf.along(routeLine, progress * routeDistance);
          const nextAlong = turf.along(routeLine, Math.min(1, progress + 0.01) * routeDistance);
          const bearing = turf.bearing(currentAlong, nextAlong);

          marker.setLngLat(currentAlong.geometry.coordinates as [number, number]);
          marker.setRotation(bearing);

          const currentIdx = Math.floor(progress * routeCoords.length);
          const trailStartIdx = Math.max(0, currentIdx - 50);
          const trailCoords = routeCoords.slice(trailStartIdx, currentIdx + 1);

          const source = instance.getSource(sourceId) as maplibregl.GeoJSONSource;
          if (source) {
            source.setData({
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: trailCoords },
              properties: {}
            });
          }

          animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
      } catch (err) {
        console.warn(`Mission telemetry failure for ${mission.id}:`, err);
      }
    };

    mapInstance.on('load', () => {
      if (!isMounted || !mapInstance) return;

      const style = mapInstance.getStyle();
      style.layers?.forEach((layer) => {
        if (layer.type === 'background') {
          mapInstance.setPaintProperty(layer.id, 'background-color', '#0B1F33');
        } else if (layer.type === 'fill' && (layer.id.includes('water') || layer.id.includes('ocean'))) {
          mapInstance.setPaintProperty(layer.id, 'fill-color', '#081622');
        } else if (layer.type === 'line' && (layer.id.includes('admin') || layer.id.includes('boundary'))) {
          mapInstance.setPaintProperty(layer.id, 'line-color', '#1E3A5F');
        } else if (layer.type === 'symbol') {
          mapInstance.setPaintProperty(layer.id, 'text-opacity', 0.5);
        }
      });

      hubNodes.forEach(hub => {
        const el = document.createElement('div');
        el.className = 'radar-node-container';
        el.innerHTML = `<div class="radar-node-pulse"></div><div class="radar-node-core"></div>`;
        el.onclick = (e) => {
          e.stopPropagation();
          setSelectedHub(hub);
          setSelection(prev => {
            const next = prev.length >= 2 ? [hub.city] : [...prev, hub.city];
            if (next.length === 2) {
                const h1 = hubNodes.find(h => h.city === next[0]);
                const h2 = hubNodes.find(h => h.city === next[1]);
                if (h1 && h2) {
                    const d = turf.distance(turf.point(h1.position), turf.point(h2.position));
                    setPriceEstimate({ from: h1.city, to: h2.city, distance: d });
                }
            } else {
                setPriceEstimate(null);
            }
            return next;
          });
        };
        new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(hub.position).addTo(mapInstance);
      });

      mapInstance.addSource('demand-forecast', { type: 'geojson', data: demandHeatmapPoints as any });
      mapInstance.addLayer({
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
          'heatmap-radius': isMobile ? 30 : 50,
          'heatmap-opacity': 0.35
        }
      });

      ACTIVE_MISSIONS_CONFIG.forEach((mission, index) => {
        setTimeout(() => { if (isMounted && map.current) animateMission(mission, map.current); }, index * 1500);
      });
    });

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !map.current.loaded()) return;
    try { map.current.setLayoutProperty('demand-heat', 'visibility', showForecast ? 'visible' : 'none'); } catch (e) {}
  }, [showForecast]);

  const calcPrice = (rate: number) => {
    if (!priceEstimate) return '---';
    const base = priceEstimate.distance * rate;
    const l = Math.round((base * 0.9) / 100000);
    const h = Math.round((base * 1.1) / 100000);
    return `₹ ${l}L – ₹ ${h}L`;
  };

  const calcTime = () => {
    if (!priceEstimate) return '---';
    const hours = priceEstimate.distance / 700;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col group">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex flex-col gap-3 max-w-[calc(100%-2rem)]">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-2xl min-w-[180px] sm:min-w-[220px]">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Demand Forecast</p>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">Predictive Heatmap</p>
            </div>
            <Button size="sm" variant={showForecast ? "default" : "outline"} onClick={() => setShowForecast(!showForecast)} className={cn("h-7 text-[8px] font-black uppercase px-3 transition-all", showForecast && "bg-primary text-white border-none shadow-[0_0_10px_rgba(14,165,233,0.5)]")}>
              {showForecast ? "ON" : "OFF"}
            </Button>
          </div>
          <Separator className="bg-white/5" />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">Empty Leg Layer</p>
              <p className="text-[8px] text-muted-foreground uppercase font-bold">Marketplace Feed</p>
            </div>
            <Button size="sm" variant={showEmptyLegs ? "default" : "outline"} onClick={() => setShowEmptyLegs(!showEmptyLegs)} className={cn("h-7 text-[8px] font-black uppercase px-3", showEmptyLegs && "bg-[#FFD166] text-black border-none")}>
              {showEmptyLegs ? "LIVE" : "OFF"}
            </Button>
          </div>
        </div>

        {priceEstimate && (
            <Card className="bg-slate-950/90 backdrop-blur-2xl border-primary/20 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-left-4 duration-500 w-full sm:w-[280px]">
                <CardHeader className="p-3 sm:p-4 pb-2 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Charter Prediction</CardTitle>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-white/40" onClick={() => setPriceEstimate(null)}><X className="h-3.5 w-3.5" /></Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{priceEstimate.from}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-bold text-white">{priceEstimate.to}</span>
                    </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] sm:text-[10px] uppercase font-bold">Flight Time</span>
                        </div>
                        <span className="text-xs font-black text-white">{calcTime()}</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                            <span className="text-[8px] sm:text-[9px] font-bold text-white/60">Citation XLS</span>
                            <span className="text-[9px] sm:text-[10px] font-black text-accent">{calcPrice(1200)}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                            <span className="text-[8px] sm:text-[9px] font-bold text-white/60">Phenom 300</span>
                            <span className="text-[9px] sm:text-[10px] font-black text-accent">{calcPrice(1000)}</span>
                        </div>
                    </div>
                    <Button className="w-full h-8 bg-primary text-white text-[9px] font-black uppercase tracking-widest gap-2">
                        Initialize RFQ Protocol <ArrowRight className="h-3 w-3" />
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>

      {selectedHub && !priceEstimate && (
        <div className="absolute bottom-4 left-4 right-4 sm:top-6 sm:right-6 sm:bottom-auto sm:left-auto z-30 sm:w-72 animate-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-500">
            <Card className="bg-slate-950/90 backdrop-blur-2xl border-accent/20 shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">{selectedHub.city} HUB</CardTitle>
                        <p className="text-[8px] text-accent uppercase font-bold">{selectedHub.status}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-white/40 hover:text-white" onClick={() => setSelectedHub(null)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-2 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Operators</p>
                            <p className="text-base sm:text-lg font-black text-white">{selectedHub.operators}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
                            <p className="text-[8px] text-muted-foreground uppercase font-bold mb-1">Empty Legs</p>
                            <p className="text-base sm:text-lg font-black text-[#FFD166]">{selectedHub.emptyLegs}</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">Verified Fleet Assets</p>
                        <div className="flex flex-wrap gap-1">
                            {selectedHub.aircraft.slice(0, 2).map(ac => (
                                <Badge key={ac} variant="outline" className="text-[7px] border-white/10 bg-white/5 text-white/70 h-4 px-1.5">{ac}</Badge>
                            ))}
                            {selectedHub.aircraft.length > 2 && <span className="text-[7px] text-muted-foreground">+{selectedHub.aircraft.length - 2} more</span>}
                        </div>
                    </div>
                    <Button className="w-full h-8 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest gap-2 shadow-xl shadow-accent/10">
                        View Sector Marketplace <ArrowRight className="h-3 w-3" />
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full rounded-3xl border border-white/5 shadow-2xl bg-[#061122]" />

      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl hidden xs:block">
        <h4 className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 sm:mb-3 border-b border-white/5 pb-2">Institutional Signals</h4>
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00FFA6] shadow-[0_0_8px_#00FFA6] animate-pulse" />
            <span className="text-[8px] sm:text-[9px] font-bold text-white/70 uppercase tracking-tighter">Active Charter Mission</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-[#00FFA6] animate-ping" />
            <span className="text-[8px] sm:text-[9px] font-bold text-white/70 uppercase tracking-tighter">Operator Network Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFD166] shadow-[0_0_8px_#FFD166]" />
            <span className="text-[8px] sm:text-[9px] font-bold text-white/70 uppercase tracking-tighter">Empty Leg Opportunity</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .radar-node-container { position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .radar-node-core { width: 6px; height: 6px; background: #00FFA6; border-radius: 50%; box-shadow: 0 0 10px #00FFA6; z-index: 2; }
        .radar-node-pulse { position: absolute; width: 28px; height: 28px; border: 2px solid #00FFA6; border-radius: 50%; animation: radar-pulse 2.5s infinite; z-index: 1; }
        @keyframes radar-pulse { 0% { transform: scale(0.2); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        .aircraft-marker { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; z-index: 100; transition: transform 0.1s linear; }
        @media (min-width: 1024px) { .aircraft-marker { width: 28px; height: 28px; } }
        .aircraft-glow { position: absolute; width: 32px; height: 32px; background: radial-gradient(circle, rgba(0,255,166,0.2) 0%, transparent 70%); border-radius: 50%; z-index: -1; animation: blink 1.5s infinite; }
        @media (min-width: 1024px) { .aircraft-glow { width: 40px; height: 40px; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .aircraft-marker svg { width: 100%; height: 100%; filter: drop-shadow(0 0 12px #00FFA6); }
      `}</style>
    </div>
  );
}
