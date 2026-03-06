'use client';

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import type { AviationHub, CharterRFQ, EmptyLeg, AircraftPosition, AircraftAvailability } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    Layers,
    Radar,
    Network,
    MapPin,
    Flame,
    Zap,
    Plane,
    MousePointer2
} from 'lucide-react';

export function OCCNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const firestore = useFirestore();

  const [layers, setLayers] = useState({
    hubs: true,
    demand: true,
    emptyLegs: true,
    radar: true,
    availability: true
  });

  // --- DATA SUBSCRIPTIONS ---
  const { data: hubs } = useCollection<AviationHub>(null, 'aviationHubs');
  const { data: rfqs } = useCollection<CharterRFQ>(null, 'charterRequests');
  const { data: legs } = useCollection<EmptyLeg>(null, 'emptyLegs');
  const { data: positions } = useCollection<AircraftPosition>(null, 'aircraftPositions');
  const { data: availability } = useCollection<AircraftAvailability>(null, 'aircraftAvailability');

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [78.9629, 22.5937],
      zoom: 4.2,
      minZoom: 3,
      maxZoom: 10,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.on('load', () => {
      // Add Sources
      mapInstance.addSource('hubs', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('demand-heatmap', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('corridors', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('radar-positions', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('availability-nodes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

      // Demand Heatmap
      mapInstance.addLayer({
        id: 'demand-heat',
        type: 'heatmap',
        source: 'demand-heatmap',
        layout: { visibility: layers.demand ? 'visible' : 'none' },
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.2, 'rgba(0,255,255,0.5)',
            0.5, 'rgba(255,165,0,0.7)',
            0.8, 'rgba(255,0,0,0.9)'
          ],
          'heatmap-radius': 40,
          'heatmap-opacity': 0.4
        }
      });

      // Hubs (Precise Geographic Projection)
      mapInstance.addLayer({
        id: 'hub-points',
        type: 'circle',
        source: 'hubs',
        layout: { visibility: layers.hubs ? 'visible' : 'none' },
        paint: {
          'circle-radius': 6,
          'circle-color': '#00FFA6',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.8
        }
      });

      // Availability Nodes (Glow Effect)
      mapInstance.addLayer({
        id: 'availability-points',
        type: 'circle',
        source: 'availability-nodes',
        layout: { visibility: layers.availability ? 'visible' : 'none' },
        paint: {
            'circle-radius': 12,
            'circle-color': ['match', ['get', 'readiness'], 'now', '#10B981', '3h', '#3B82F6', '#F59E0B'],
            'circle-opacity': 0.3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
        }
      });

      // Corridor Arcs (Empty Legs)
      mapInstance.addLayer({
        id: 'corridor-lines',
        type: 'line',
        source: 'corridors',
        layout: { visibility: layers.emptyLegs ? 'visible' : 'none' },
        paint: {
          'line-color': '#D4AF37',
          'line-width': 2,
          'line-dasharray': [4, 4],
          'line-opacity': 0.6
        }
      });

      // Radar Positions (Live Simulation)
      mapInstance.addLayer({
        id: 'radar-points',
        type: 'circle',
        source: 'radar-positions',
        layout: { visibility: layers.radar ? 'visible' : 'none' },
        paint: {
            'circle-radius': 5,
            'circle-color': ['match', ['get', 'status'], 'inflight', '#F43F5E', 'available', '#10B981', '#3B82F6'],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000'
        }
      });
    });

    return () => {
        if (map.current) {
            map.current.remove();
            map.current = null;
        }
    };
  }, []);

  // Sync Data to Sources
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (hubs) {
        const hubFeatures = hubs.map(h => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [h.longitude, h.latitude] }, properties: { city: h.city } }));
        (map.current.getSource('hubs') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: hubFeatures } as any);
    }

    if (rfqs) {
        const demandFeatures = rfqs.map(r => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [72.8 + Math.random(), 19.0 + Math.random()] }, properties: { intensity: 0.8 } }));
        (map.current.getSource('demand-heatmap') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: demandFeatures } as any);
    }

    if (positions) {
        const radarFeatures = positions.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] }, properties: { reg: p.registration, status: p.status } }));
        (map.current.getSource('radar-positions') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: radarFeatures } as any);
    }
  }, [hubs, rfqs, positions]);

  // Layer Visibility Control
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    map.current.setLayoutProperty('hub-points', 'visibility', layers.hubs ? 'visible' : 'none');
    map.current.setLayoutProperty('demand-heat', 'visibility', layers.demand ? 'visible' : 'none');
    map.current.setLayoutProperty('corridor-lines', 'visibility', layers.emptyLegs ? 'visible' : 'none');
    map.current.setLayoutProperty('radar-points', 'visibility', layers.radar ? 'visible' : 'none');
    map.current.setLayoutProperty('availability-points', 'visibility', layers.availability ? 'visible' : 'none');
  }, [layers]);

  return (
    <div className="w-full h-full relative group">
        <div ref={mapContainer} className="w-full h-full rounded-2xl border border-white/5" />
        
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Layers className="h-3 w-3 text-accent" />
                        Intelligence Layers
                    </span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="hub-toggle" className="text-[9px] uppercase font-bold text-white/70">Operator Hubs</Label>
                    <Switch id="hub-toggle" checked={layers.hubs} onCheckedChange={(v) => setLayers(l => ({ ...l, hubs: v }))} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="demand-toggle" className="text-[9px] uppercase font-bold text-white/70">Demand Heatmap</Label>
                    <Switch id="demand-toggle" checked={layers.demand} onCheckedChange={(v) => setLayers(l => ({ ...l, demand: v }))} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="corridor-toggle" className="text-[9px] uppercase font-bold text-white/70">Empty Leg Corridors</Label>
                    <Switch id="corridor-toggle" checked={layers.emptyLegs} onCheckedChange={(v) => setLayers(l => ({ ...l, emptyLegs: v }))} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="radar-toggle" className="text-[9px] uppercase font-bold text-white/70">Global Radar</Label>
                    <Switch id="radar-toggle" checked={layers.radar} onCheckedChange={(v) => setLayers(l => ({ ...l, radar: v }))} />
                </div>
            </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">In Flight</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Scheduled</span>
            </div>
        </div>
    </div>
  );
}
