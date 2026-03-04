'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const hubNodes = [
  { city: 'Delhi', lat: 28.6139, lng: 77.2090, label: 'NSOP Operator Base' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, label: 'NSOP Operator Base' },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, label: 'NSOP Operator Base' },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, label: 'NSOP Operator Base' },
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946, label: 'NSOP Operator Base' },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, label: 'NSOP Operator Base' },
];

const corridors = [
  { from: [77.2090, 28.6139], to: [72.8777, 19.0760] }, // Delhi-Mumbai
  { from: [72.8777, 19.0760], to: [77.5946, 12.9716] }, // Mumbai-Bengaluru
  { from: [77.5946, 12.9716], to: [80.2707, 13.0827] }, // Bengaluru-Chennai
  { from: [78.4867, 17.3850], to: [72.8777, 19.0760] }, // Hyderabad-Mumbai
  { from: [88.3639, 22.5726], to: [77.2090, 28.6139] }, // Kolkata-Delhi
];

export function IndiaOperatorNetworkMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [78.9629, 22.5937], // India Center
      zoom: 4.5,
      bearing: 0,
      pitch: 0,
      interactive: true,
      dragRotate: false,
      touchPitch: false,
    });

    const map = mapRef.current;

    map.on('load', () => {
      // Add animated corridors
      corridors.forEach((corridor, index) => {
        const sourceId = `corridor-${index}`;
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [corridor.from, corridor.to],
            },
          },
        });

        map.addLayer({
          id: sourceId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#00d4ff',
            'line-width': 1.5,
            'line-opacity': 0.4,
            'line-dasharray': [2, 2],
          },
        });

        // Simple dash animation logic
        let step = 0;
        function animate() {
          step = (step + 0.1) % 4;
          map.setPaintProperty(sourceId, 'line-dasharray', [2, 2, step, 0]);
          requestAnimationFrame(animate);
        }
        // animate(); // Uncomment if native line-dasharray animation is needed, but CSS is cleaner for performance
      });

      // Add Hub Markers
      hubNodes.forEach((hub) => {
        const el = document.createElement('div');
        el.className = 'hub-marker';
        el.style.width = '12px';
        el.style.height = '12px';
        el.style.backgroundColor = '#00ffa6';
        el.style.borderRadius = '50%';
        el.style.boxShadow = '0 0 15px #00ffa6, 0 0 5px #00ffa6 inset';
        el.style.cursor = 'pointer';
        
        // Add subtle pulse
        el.style.animation = 'pulse-marker 2s infinite ease-in-out';

        const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
          .setHTML(`<div class="p-2 bg-slate-900 border border-white/10 rounded shadow-xl">
            <p class="text-[10px] font-black uppercase text-accent tracking-widest">${hub.city}</p>
            <p class="text-[9px] text-white/60 font-bold">${hub.label}</p>
          </div>`);

        new maplibregl.Marker(el)
          .setLngLat([hub.lng, hub.lat])
          .setPopup(popup)
          .addTo(map);
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      {/* Map Overlays */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ffa6] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Live Network Grid</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-marker {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(0, 255, 166, 0.7); }
          70% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 10px rgba(0, 255, 166, 0); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(0, 255, 166, 0); }
        }
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        .maplibregl-popup-tip {
          border-top-color: rgba(15, 23, 42, 0.9) !important;
        }
      `}</style>
    </div>
  );
}
