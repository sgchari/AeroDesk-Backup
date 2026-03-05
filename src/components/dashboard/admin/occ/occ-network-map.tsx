'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';

// --- INSTITUTIONAL ASSETS ---
const hubs = [
  { city: 'Delhi', pos: [77.1025, 28.7041], status: 'backbone' },
  { city: 'Mumbai', pos: [72.8777, 19.0760], status: 'backbone' },
  { city: 'Bengaluru', pos: [77.5946, 12.9716], status: 'hub' },
  { city: 'Hyderabad', pos: [78.4867, 17.3850], status: 'hub' },
  { city: 'Kolkata', pos: [88.3639, 22.5726], status: 'hub' },
  { city: 'Chennai', pos: [80.2707, 13.0827], status: 'hub' },
];

const activeMissions = [
    { id: 'ADX-402', from: [72.8777, 19.0760], to: [77.1025, 28.7041], aircraft: 'Legacy 650' },
    { id: 'ADX-112', from: [77.5946, 12.9716], to: [72.8777, 19.0760], aircraft: 'Phenom 300' },
];

export function OCCNetworkMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [78.9629, 22.5937],
      zoom: 4.2,
      minZoom: 3,
      maxZoom: 8,
      attributionControl: false,
      scrollZoom: false,
      dragPan: true,
    });

    map.current = mapInstance;

    mapInstance.on('load', () => {
      if (!map.current) return;

      // --- OPERATOR HUB NODES ---
      hubs.forEach(hub => {
        const el = document.createElement('div');
        el.className = 'radar-node';
        el.innerHTML = `
            <div class="radar-pulse"></div>
            <div class="radar-core"></div>
            <div class="radar-label">${hub.city}</div>
        `;
        new maplibregl.Marker({ element: el }).setLngLat(hub.pos as [number, number]).addTo(mapInstance);
      });

      // --- ACTIVE MISSION TELEMETRY ---
      activeMissions.forEach((mission) => {
        const routeId = `route-${mission.id}`;
        
        mapInstance.addSource(routeId, {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [mission.from, mission.to]
                }
            }
        });

        mapInstance.addLayer({
            'id': routeId,
            'type': 'line',
            'source': routeId,
            'layout': { 'line-join': 'round', 'line-cap': 'round' },
            'paint': {
                'line-color': '#0EA5E9',
                'line-width': 1.5,
                'line-dasharray': [4, 4],
                'line-opacity': 0.4
            }
        });

        // Pulse Marker for Flight
        const planeEl = document.createElement('div');
        planeEl.className = 'flight-marker';
        planeEl.innerHTML = `
            <div class="flight-pulse"></div>
            <div class="flight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; transform: rotate(45deg);"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.2-2.1.5-2.4 1.5l-.4 1.3c-.2.7.3 1.4 1 1.6l7.4 2.1-3.1 3.1-3.3-.6c-.6-.1-1.3.2-1.6.8l-.4 1.1c-.2.7.3 1.4 1 1.6l4 .8 1.6 4c.2.7.9 1.2 1.6 1l1.1-.4c.6-.3.9-1 .8-1.6l-.6-3.3 3.1-3.1 2.1 7.4c.2.7.9 1.2 1.6 1l1.3-.4c1.1-.3 1.7-1.3 1.5-2.4z"/></svg>
            </div>
            <div class="flight-id">${mission.id}</div>
        `;
        
        const midPoint: [number, number] = [
            (mission.from[0] + mission.to[0]) / 2,
            (mission.from[1] + mission.to[1]) / 2
        ];
        
        new maplibregl.Marker({ element: planeEl }).setLngLat(midPoint).addTo(mapInstance);
      });
    });

    return () => {
        if (map.current) {
            map.current.remove();
            map.current = null;
        }
    };
  }, []);

  return (
    <div className="w-full h-full relative group">
        <div ref={mapContainer} className="w-full h-full" />
        
        <style jsx global>{`
            .radar-node { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
            .radar-core { width: 6px; height: 6px; background: #00FFA6; border-radius: 50%; box-shadow: 0 0 10px #00FFA6; }
            .radar-pulse { position: absolute; width: 24px; height: 24px; border: 2px solid #00FFA6; border-radius: 50%; animation: radar-ping 3s infinite; }
            .radar-label { position: absolute; top: 100%; margin-top: 4px; font-size: 8px; font-weight: 900; color: #00FFA6; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; }
            
            .flight-marker { position: relative; display: flex; flex-direction: column; align-items: center; }
            .flight-icon { width: 20px; height: 20px; background: #0EA5E9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 0 15px rgba(14, 165, 233, 0.6); border: 1px solid rgba(255,255,255,0.2); }
            .flight-pulse { position: absolute; width: 30px; height: 30px; background: rgba(14, 165, 233, 0.2); border-radius: 50%; animation: flight-glow 2s infinite; }
            .flight-id { margin-top: 4px; font-family: monospace; font-size: 8px; font-weight: bold; color: #0EA5E9; background: rgba(0,0,0,0.6); padding: 1px 4px; border-radius: 4px; }

            @keyframes radar-ping { 0% { transform: scale(0.2); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
            @keyframes flight-glow { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.4); opacity: 0; } }
        `}</style>
    </div>
  );
}
