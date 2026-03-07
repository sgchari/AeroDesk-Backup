'use client';

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { useCollection } from '@/firebase';
import type { AviationHub, CharterRFQ, EmptyLeg, AircraftPosition, AircraftAvailability, CharterDemandForecast } from '@/lib/types';
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
    TrendingUp
} from 'lucide-react';

export function OCCNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mounted, setMounted] = useState(false);
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
  const { data: forecasts } = useCollection<CharterDemandForecast>(null, 'charterDemandForecast');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainer.current || map.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [78.9629, 22.5937],
      zoom: 4.3,
      minZoom: 3,
      maxZoom: 10,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.on('load', () => {
      // Add Sources
      mapInstance.addSource('hubs', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('demand-heatmap', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('empty-leg-corridors', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('live-radar', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      mapInstance.addSource('availability-nodes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

      // 1. Demand Heatmap
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
            0, 'rgba(42, 127, 255, 0)',
            0.2, '#2A7FFF',
            0.5, '#00FFA6',
            0.8, '#FFD166',
            1, '#F43F5E'
          ],
          'heatmap-radius': 50,
          'heatmap-opacity': 0.4
        }
      });

      // 2. Empty Leg Corridors (Dashed Arcs)
      mapInstance.addLayer({
        id: 'corridor-arcs',
        type: 'line',
        source: 'empty-leg-corridors',
        layout: { visibility: layers.emptyLegs ? 'visible' : 'none', 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#D4AF37', 'line-width': 2, 'line-dasharray': [4, 2], 'line-opacity': 0.6 }
      });

      // 3. Availability Nodes
      mapInstance.addLayer({
        id: 'availability-points',
        type: 'circle',
        source: 'availability-nodes',
        layout: { visibility: layers.availability ? 'visible' : 'none' },
        paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 8, 10, 20],
            'circle-color': ['match', ['get', 'window'], '3hours', '#10B981', '6hours', '#3B82F6', '#F59E0B'],
            'circle-opacity': 0.3,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#FFFFFF'
        }
      });

      // 4. Live Radar Positions
      mapInstance.addLayer({
        id: 'radar-points',
        type: 'circle',
        source: 'live-radar',
        layout: { visibility: layers.radar ? 'visible' : 'none' },
        paint: {
            'circle-radius': 5,
            'circle-color': ['match', ['get', 'status'], 'inflight', '#F43F5E', 'available', '#10B981', '#3B82F6'],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#000'
        }
      });

      // 5. Institutional Hubs
      mapInstance.addLayer({
        id: 'hub-markers',
        type: 'circle',
        source: 'hubs',
        layout: { visibility: layers.hubs ? 'visible' : 'none' },
        paint: { 'circle-radius': 4, 'circle-color': '#FFFFFF', 'circle-stroke-width': 2, 'circle-stroke-color': '#00FFA6' }
      });
    });

    return () => {
        if (map.current) {
            map.current.remove();
            map.current = null;
        }
    };
  }, [mounted]);

  // --- DATA SYNC TO GEOJSON SOURCES ---
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (hubs) {
        const features = hubs.map(h => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [h.longitude, h.latitude] }, properties: { city: h.city } }));
        (map.current.getSource('hubs') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
    }

    if (forecasts) {
        // Use consistent grid points for demand heatmap instead of random ones to prevent re-render loops
        const features = forecasts.map((f, i) => ({ 
            type: 'Feature', 
            geometry: { 
                type: 'Point', 
                coordinates: [72.8 + (i * 0.5), 19.0 + (i * 0.5)] 
            }, 
            properties: { intensity: f.predictedDemandScore / 100 } 
        }));
        (map.current.getSource('demand-heatmap') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
    }

    if (positions) {
        const features = positions.map(p => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] }, properties: { status: p.status } }));
        (map.current.getSource('live-radar') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
    }

    if (availability) {
        const features = availability.map(a => {
            const hub = hubs?.find(h => h.icao === a.currentAirport);
            return { type: 'Feature', geometry: { type: 'Point', coordinates: [hub?.longitude || 0, hub?.latitude || 0] }, properties: { window: a.availabilityWindow } };
        });
        (map.current.getSource('availability-nodes') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
    }
  }, [hubs, forecasts, positions, availability]);

  // --- LAYER VISIBILITY SYNC ---
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    map.current.setLayoutProperty('hub-markers', 'visibility', layers.hubs ? 'visible' : 'none');
    map.current.setLayoutProperty('demand-heat', 'visibility', layers.demand ? 'visible' : 'none');
    map.current.setLayoutProperty('corridor-arcs', 'visibility', layers.emptyLegs ? 'visible' : 'none');
    map.current.setLayoutProperty('radar-points', 'visibility', layers.radar ? 'visible' : 'none');
    map.current.setLayoutProperty('availability-points', 'visibility', layers.availability ? 'visible' : 'none');
  }, [layers]);

  if (!mounted) return <div className="w-full h-full bg-slate-900/50 rounded-2xl border border-white/5 animate-pulse" />;

  return (
    <div className="w-full h-full relative group">
        <div ref={mapContainer} className="w-full h-full rounded-2xl border border-white/5 bg-[#061122]" />
        
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Layers className="h-3 w-3 text-accent" />
                        Intelligence Layers
                    </span>
                </div>
                
                {[
                    { key: 'hubs', label: 'Operator Hubs', icon: MapPin },
                    { key: 'demand', label: 'Demand Heatmap', icon: Flame },
                    { key: 'emptyLegs', label: 'Corridors (EL)', icon: Zap },
                    { key: 'radar', label: 'Global Radar', icon: Radar },
                    { key: 'availability', label: 'Availability Grid', icon: Network }
                ].map(layer => (
                    <div key={layer.key} className="flex items-center justify-between gap-4">
                        <Label htmlFor={`${layer.key}-toggle`} className="text-[9px] uppercase font-bold text-white/70 flex items-center gap-2 cursor-pointer">
                            <layer.icon className="h-3 w-3" /> {layer.label}
                        </Label>
                        <Switch 
                            id={`${layer.key}-toggle`} 
                            checked={(layers as any)[layer.key]} 
                            onCheckedChange={(v) => setLayers(l => ({ ...l, [layer.key]: v }))} 
                        />
                    </div>
                ))}
            </div>
        </div>

        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Available Now</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F43F5E]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">In Flight</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                <span className="text-[8px] uppercase font-black text-white/60 tracking-widest">Scheduled (3h)</span>
            </div>
        </div>
    </div>
  );
}
