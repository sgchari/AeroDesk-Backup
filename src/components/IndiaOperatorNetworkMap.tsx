
'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define Hub Nodes
const hubNodes = [
  { city: 'Delhi', position: [28.6139, 77.2090] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Mumbai', position: [19.0760, 72.8777] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Hyderabad', position: [17.3850, 78.4867] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Chennai', position: [13.0827, 80.2707] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Bengaluru', position: [12.9716, 77.5946] as [number, number], label: 'NSOP Operator Base' },
  { city: 'Kolkata', position: [22.5726, 88.3639] as [number, number], label: 'NSOP Operator Base' },
];

// Define Connection Corridors
const corridors = [
  { from: [28.6139, 77.2090] as [number, number], to: [19.0760, 72.8777] as [number, number] }, // Delhi-Mumbai
  { from: [19.0760, 72.8777] as [number, number], to: [12.9716, 77.5946] as [number, number] }, // Mumbai-Bengaluru
  { from: [12.9716, 77.5946] as [number, number], to: [13.0827, 80.2707] as [number, number] }, // Bengaluru-Chennai
  { from: [17.3850, 78.4867] as [number, number], to: [19.0760, 72.8777] as [number, number] }, // Hyderabad-Mumbai
  { from: [22.5726, 88.3639] as [number, number], to: [28.6139, 77.2090] as [number, number] }, // Kolkata-Delhi
];

// Custom Glowing Icon
const createHubIcon = () => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="hub-marker-wrapper">
        <div class="hub-marker-core"></div>
        <div class="hub-marker-pulse"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export function IndiaOperatorNetworkMap() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[600px] bg-slate-950/50 rounded-3xl animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground text-xs uppercase font-black tracking-widest">Initializing Geographic Grid...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-slate-950/50">
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        boxZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* Connection Corridors */}
        {corridors.map((corridor, idx) => (
          <Polyline
            key={`corridor-${idx}`}
            positions={[corridor.from, corridor.to]}
            pathOptions={{
              color: '#00d4ff',
              weight: 1.5,
              opacity: 0.3,
              dashArray: '4, 8',
              className: 'animated-corridor'
            }}
          />
        ))}

        {/* Hub Markers */}
        {hubNodes.map((hub) => (
          <Marker
            key={hub.city}
            position={hub.position}
            icon={createHubIcon()}
          >
            <Popup className="custom-map-popup">
              <div className="p-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-0">{hub.city}</p>
                <p className="text-[9px] text-white/60 font-bold mt-0">{hub.label}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .hub-marker-wrapper {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          items-center: center;
          justify-content: center;
        }
        .hub-marker-core {
          width: 8px;
          height: 8px;
          background-color: #00ffa6;
          border-radius: 50%;
          box-shadow: 0 0 10px #00ffa6;
          z-index: 2;
        }
        .hub-marker-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #00ffa6;
          border-radius: 50%;
          animation: pulse-marker 2s infinite ease-in-out;
          opacity: 0.5;
          z-index: 1;
        }
        @keyframes pulse-marker {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animated-corridor {
          stroke-dashoffset: 100;
          animation: flow-line 20s linear infinite;
        }
        @keyframes flow-line {
          to { stroke-dashoffset: 0; }
        }
        .leaflet-container {
          background: transparent !important;
        }
        .custom-map-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(8px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          color: white;
        }
        .custom-map-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.95);
        }
        .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
