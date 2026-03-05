'use client';

import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { AircraftPosition } from '@/lib/types';

interface RadarSurfaceMapProps {
    positions: AircraftPosition[];
    showHeatmap: boolean;
}

export function RadarSurfaceMap({ positions, showHeatmap }: RadarSurfaceMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markers = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [78.9629, 23.5937],
            zoom: 4,
            attributionControl: false,
        });

        map.current = mapInstance;

        mapInstance.on('load', () => {
            // Add heatmap source (simulated demand points)
            mapInstance.addSource('demand-forecast', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', properties: { weight: 0.9 }, geometry: { type: 'Point', coordinates: [72.8777, 19.0760] } }, // Mumbai
                        { type: 'Feature', properties: { weight: 0.8 }, geometry: { type: 'Point', coordinates: [77.1025, 28.7041] } }, // Delhi
                        { type: 'Feature', properties: { weight: 0.7 }, geometry: { type: 'Point', coordinates: [77.5946, 12.9716] } }, // BLR
                    ]
                }
            });

            mapInstance.addLayer({
                id: 'demand-heat',
                type: 'heatmap',
                source: 'demand-forecast',
                layout: { visibility: showHeatmap ? 'visible' : 'none' },
                paint: {
                    'heatmap-weight': ['get', 'weight'],
                    'heatmap-intensity': 1,
                    'heatmap-color': [
                        'interpolate', ['linear'], ['heatmap-density'],
                        0, 'rgba(212, 175, 55, 0)',
                        0.5, 'rgba(212, 175, 55, 0.3)',
                        1, 'rgba(212, 175, 55, 0.6)'
                    ],
                    'heatmap-radius': 50,
                    'heatmap-opacity': 0.4
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

    // Update markers when positions change
    useEffect(() => {
        if (!map.current) return;

        // Clear existing markers
        markers.current.forEach(m => m.remove());
        markers.current = [];

        positions.forEach(p => {
            const el = document.createElement('div');
            el.className = 'radar-aircraft-marker';
            
            const color = p.status === 'inflight' ? '#F43F5E' : p.status === 'available' ? '#10B981' : '#F59E0B';
            
            el.innerHTML = `
                <div class="plane-pulse" style="background: ${color}20; border-color: ${color}40"></div>
                <div class="plane-icon" style="transform: rotate(${p.heading}deg); color: ${color}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.2-2.1.5-2.4 1.5l-.4 1.3c-.2.7.3 1.4 1 1.6l7.4 2.1-3.1 3.1-3.3-.6c-.6-.1-1.3.2-1.6.8l-.4 1.1c-.2.7.3 1.4 1 1.6l4 .8 1.6 4c.2.7.9 1.2 1.6 1l1.1-.4c.6-.3.9-1 .8-1.6l-.6-3.3 3.1-3.1 2.1 7.4c.2.7.9 1.2 1.6 1l1.3-.4c1.1-.3 1.7-1.3 1.5-2.4z"/></svg>
                </div>
                <div class="plane-label">${p.registration}</div>
            `;

            const marker = new maplibregl.Marker({ element: el }).setLngLat([p.longitude, p.latitude]).addTo(map.current!);
            markers.current.push(marker);
        });
    }, [positions]);

    // Toggle heatmap
    useEffect(() => {
        if (map.current?.getLayer('demand-heat')) {
            map.current.setLayoutProperty('demand-heat', 'visibility', showHeatmap ? 'visible' : 'none');
        }
    }, [showHeatmap]);

    return (
        <div className="w-full h-full rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
            <div ref={mapContainer} className="w-full h-full" />
            <style jsx global>{`
                .radar-aircraft-marker { position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
                .plane-icon { background: rgba(0,0,0,0.6); padding: 4px; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 2; transition: all 0.3s; }
                .plane-pulse { position: absolute; width: 30px; height: 30px; border: 1px solid; border-radius: 50%; animation: radar-ping 2s infinite; z-index: 1; }
                .plane-label { margin-top: 4px; font-family: monospace; font-size: 8px; font-weight: bold; color: white; background: rgba(0,0,0,0.7); padding: 1px 4px; border-radius: 4px; text-transform: uppercase; white-space: nowrap; }
                @keyframes radar-ping { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
            `}</style>
        </div>
    );
}
