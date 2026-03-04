'use client';

import React, { useEffect, useRef } from 'react';

// Use a dynamic link to avoid build-time resolution errors
const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@5.1.0/dist/maplibre-gl.css';

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
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically load the CSS to prevent build-time resolution issues
    if (!document.getElementById('maplibre-css')) {
      const link = document.createElement('link');
      link.id = 'maplibre-css';
      link.rel = 'stylesheet';
      link.href = MAPLIBRE_CSS;
      document.head.appendChild(link);
    }

    const initMap = async () => {
      try {
        // Dynamic import to avoid SSR errors and module resolution issues in turbopack build
        const maplibregl = (await import('maplibre-gl')).default;
        
        if (!mapContainerRef.current) return;

        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
          center: [78.9629, 22.5937], // Centered on India
          zoom: 4.2,
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
                'line-opacity': 0.3,
                'line-dasharray': [2, 2],
              },
            });
          });

          // Add Hub Markers
          hubNodes.forEach((hub) => {
            const el = document.createElement('div');
            el.className = 'hub-marker-container';
            el.innerHTML = `
              <div class="hub-marker-core"></div>
              <div class="hub-marker-pulse"></div>
            `;
            
            const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
              .setHTML(`
                <div class="map-popup">
                  <p class="popup-title">${hub.city}</p>
                  <p class="popup-subtitle">${hub.label}</p>
                </div>
              `);

            new maplibregl.Marker({ element: el })
              .setLngLat([hub.lng, hub.lat] as [number, number])
              .setPopup(popup)
              .addTo(map);
          });
        });
      } catch (err) {
        console.error("MapLibre Initialization Error:", err);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-slate-950/50">
      <div ref={mapContainerRef} className="absolute inset-0" />
      
      <style jsx global>{`
        .hub-marker-container {
          position: relative;
          width: 12px;
          height: 12px;
          cursor: pointer;
        }
        .hub-marker-core {
          width: 100%;
          height: 100%;
          background-color: #00ffa6;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ffa6;
          z-index: 2;
          position: relative;
        }
        .hub-marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #00ffa6;
          border-radius: 50%;
          animation: pulse-marker 2s infinite ease-in-out;
          opacity: 0.5;
          z-index: 1;
        }
        @keyframes pulse-marker {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        .map-popup {
          padding: 8px 12px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px border rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .popup-title {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          color: #FFFFBD;
          letter-spacing: 0.1em;
          margin: 0;
        }
        .popup-subtitle {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          margin: 2px 0 0 0;
        }
        .maplibregl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        .maplibregl-popup-tip {
          border-top-color: rgba(15, 23, 42, 0.95) !important;
        }
      `}</style>
    </div>
  );
}