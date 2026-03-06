'use client';

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
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
    Plane
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
    availability: false
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
          'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,255,0)', 0.5, 'rgba(255,165,0,0.6)', 1, 'rgba(255,0,0,1)'],
          'heatmap-radius': 40,
          'heatmap-opacity': 0.4
        }
      });

      // Corridor Arcs
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

      // Hubs
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

      // Radar Positions (Live)
      mapInstance.addLayer({
        id: 'radar-points',
        type: 'symbol',
        source: 'radar-positions',
        layout: { 
            visibility: layers.radar ? 'visible' : 'none',
            'icon-image': 'airport',
            'icon-size': 1.2,
            'icon-rotate': ['get', 'heading'],
            'text-field': ['get', 'reg'],
            'text-offset': [0, 1.2],
            'text-size': 8,
            'text-font': ['Open Sans Bold']
        },
        paint: {
            'icon-color': ['match', ['get', 'status'], 'inflight', '#F43F5E', 'available', '#10B981', '#3B82F6'],
            'text-color': '#FFFFFF'
        }
      });

      // Availability Nodes
      mapInstance.addLayer({
        id: 'availability-points',
        type: 'circle',
        source: 'availability-nodes',
        layout: { visibility: layers.availability ? 'visible' : 'none' },
        paint: {
            'circle-radius': 10,
            'circle-color': ['match', ['get', 'window'], '3hours', '#10B981', '6hours', '#3B82F6', '#F59E0B'],
            'circle-opacity': 0.3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
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

  // Sync Data Logic
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (hubs) {
        const hubFeatures = hubs.map(h => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [h.longitude, h.latitude] }, properties: { city: h.city } }));
        (map.current.getSource('hubs') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: hubFeatures } as any);
    }

    if (positions) {
        const radarFeatures = positions.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] }, properties: { reg: p.registration, heading: p.heading, status: p.status } }));
        (map.current.getSource('radar-positions') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: radarFeatures } as any);
    }

    if (availability) {
        const availFeatures = availability.map(a => {
            const hub = hubs?.find(h => h.icao === a.currentAirport);
            if (!hub) return null;
            return { type: 'Feature', geometry: { type: 'Point', coordinates: [hub.longitude, hub.latitude] }, properties: { window: a.availabilityWindow } };
        }).filter(f => !!f);
        (map.current.getSource('availability-nodes') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features: availFeatures } as any);
    }
  }, [hubs, positions, availability]);

  // Layer Visibility Effect
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
        <div ref={mapContainer} className="w-full h-full" />
        
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Layers className="h-3 w-3 text-accent" />
                        Radar Controls
                    </span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="radar-toggle" className="text-[9px] uppercase font-bold text-white/70">Global Radar</Label>
                    <Switch id="radar-toggle" checked={layers.radar} onCheckedChange={(v) => setLayers(l => ({ ...l, radar: v }))} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="avail-toggle" className="text-[9px] uppercase font-bold text-white/70">Availability Grid</Label>
                    <Switch id="avail-toggle" checked={layers.availability} onCheckedChange={(v) => setLayers(l => ({ ...l, availability: v }))} />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="demand-toggle" className="text-[9px] uppercase font-bold text-white/70">Demand Heatmap</Label>
                    <Switch id="demand-toggle" checked={layers.demand} onCheckedChange={(v) => setLayers(l => ({ ...l, demand: v }))} />
                </div>
            </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Ground Ready</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                    <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Active Mission</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                    <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Scheduled Tech</span>
                </div>
            </div>
        </div>
    </div>
  );
}
