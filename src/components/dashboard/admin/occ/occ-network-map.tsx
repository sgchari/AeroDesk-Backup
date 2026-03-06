'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { AviationHub, CharterRFQ, EmptyLeg, FlightSegment } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    MapPin, 
    Flame, 
    Zap, 
    Activity, 
    Plane, 
    Clock, 
    Info, 
    ShieldCheck, 
    GanttChartSquare,
    Layers,
    Target
} from 'lucide-react';

export function OCCNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const firestore = useFirestore();

  const [layers, setLayers] = useState({
    hubs: true,
    demand: true,
    emptyLegs: true
  });

  // --- DATA SUBSCRIPTIONS ---
  const hubsQuery = useMemoFirebase(() => (firestore && !(firestore as any)._isMock) ? null : null, [firestore]);
  const { data: hubs } = useCollection<AviationHub>(hubsQuery, 'aviationHubs');
  
  const rfqsQuery = useMemoFirebase(() => (firestore && !(firestore as any)._isMock) ? null : null, [firestore]);
  const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const legsQuery = useMemoFirebase(() => (firestore && !(firestore as any)._isMock) ? null : null, [firestore]);
  const { data: legs } = useCollection<EmptyLeg>(legsQuery, 'emptyLegs');

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

      // Add Heatmap Layer
      mapInstance.addLayer({
        id: 'demand-heat',
        type: 'heatmap',
        source: 'demand-heatmap',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgba(65, 105, 225, 0.4)',
            0.5, 'rgba(255, 165, 0, 0.6)',
            0.8, 'rgba(255, 69, 0, 0.8)',
            1, 'rgba(255, 0, 0, 1)'
          ],
          'heatmap-radius': 40,
          'heatmap-opacity': 0.4
        }
      });

      // Add Corridor Layer
      mapInstance.addLayer({
        id: 'corridor-lines',
        type: 'line',
        source: 'corridors',
        paint: {
          'line-color': '#D4AF37',
          'line-width': 2,
          'line-dasharray': [4, 4],
          'line-opacity': 0.6
        }
      });

      // Add Hub Circle Layer (Dynamic Projection)
      mapInstance.addLayer({
        id: 'hub-points',
        type: 'circle',
        source: 'hubs',
        paint: {
          'circle-radius': 6,
          'circle-color': '#00FFA6',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.8
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

  // Sync Hubs
  useEffect(() => {
    if (!map.current || !hubs || !map.current.isStyleLoaded()) return;
    const features = hubs.map(hub => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [hub.longitude, hub.latitude] },
      properties: { name: hub.city, icao: hub.icao }
    }));
    (map.current.getSource('hubs') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
  }, [hubs]);

  // Sync Demand Heatmap
  useEffect(() => {
    if (!map.current || !rfqs || !map.current.isStyleLoaded()) return;
    
    // Simulate intensity based on destination clusters
    const destinationMap: Record<string, number> = {};
    rfqs.forEach(r => {
        const dest = r.arrival.split(' (')[0];
        destinationMap[dest] = (destinationMap[dest] || 0) + 1;
    });

    const features = hubs?.filter(h => destinationMap[h.city]).map(hub => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [hub.longitude, hub.latitude] },
        properties: { intensity: (destinationMap[hub.city] || 1) / 5 }
    })) || [];

    (map.current.getSource('demand-heatmap') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
  }, [rfqs, hubs]);

  // Sync Corridors
  useEffect(() => {
    if (!map.current || !legs || !hubs || !map.current.isStyleLoaded()) return;

    const features: any[] = [];
    legs.forEach(leg => {
        const start = hubs.find(h => leg.departure.includes(h.city));
        const end = hubs.find(h => leg.arrival.includes(h.city));
        if (start && end) {
            features.push({
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [start.longitude, start.latitude],
                        [end.longitude, end.latitude]
                    ]
                }
            });
        }
    });

    (map.current.getSource('corridors') as maplibregl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
  }, [legs, hubs]);

  // Handle Layer Visibility
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    map.current.setLayoutProperty('hub-points', 'visibility', layers.hubs ? 'visible' : 'none');
    map.current.setLayoutProperty('demand-heat', 'visibility', layers.demand ? 'visible' : 'none');
    map.current.setLayoutProperty('corridor-lines', 'visibility', layers.emptyLegs ? 'visible' : 'none');
  }, [layers]);

  return (
    <div className="w-full h-full relative group">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Layer Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 space-y-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Layers className="h-3 w-3 text-accent" />
                        Radar Layers
                    </span>
                </div>
                
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="hubs-toggle" className="text-[9px] uppercase font-bold text-white/70">Operator Hubs</Label>
                    <Switch 
                        id="hubs-toggle" 
                        checked={layers.hubs} 
                        onCheckedChange={(v) => setLayers(l => ({ ...l, hubs: v }))} 
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="demand-toggle" className="text-[9px] uppercase font-bold text-white/70">Demand Heatmap</Label>
                    <Switch 
                        id="demand-toggle" 
                        checked={layers.demand} 
                        onCheckedChange={(v) => setLayers(l => ({ ...l, demand: v }))} 
                    />
                </div>

                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="legs-toggle" className="text-[9px] uppercase font-bold text-white/70">Empty Corridors</Label>
                    <Switch 
                        id="legs-toggle" 
                        checked={layers.emptyLegs} 
                        onCheckedChange={(v) => setLayers(l => ({ ...l, emptyLegs: v }))} 
                    />
                </div>
            </div>
        </div>

        {/* Dynamic Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00FFA6]" />
                    <span className="text-[8px] uppercase font-black text-white/60">Verified NSOP Hub</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-0.5 bg-[#D4AF37] border-t border-dashed" />
                    <span className="text-[8px] uppercase font-black text-white/60">Empty Leg Corridor</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-rose-500/40" />
                    <span className="text-[8px] uppercase font-black text-white/60">High Demand Cluster</span>
                </div>
            </div>
        </div>
    </div>
  );
}
