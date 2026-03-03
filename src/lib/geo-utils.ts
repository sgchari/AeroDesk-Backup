/**
 * @fileOverview Institutional Geographic Utilities for AeroDesk.
 * Handles precision projection mapping for the India landmass using real-world bounds.
 */

export interface GeoCoord {
    lat: number;
    lng: number;
}

// Precision Bounding Box for the Indian Subcontinent
const MAP_BOUNDS = {
    minLng: 68.1, // Gujarat West
    maxLng: 97.4, // Arunachal East
    minLat: 8.0,  // Kanyakumari South
    maxLat: 37.5  // Ladakh North
};

/**
 * Geographic Projection Engine
 * Maps real-world Lat/Lng to a calibrated 1000x1000 SVG coordinate space.
 */
export function project(lat: number, lng: number): { x: number; y: number } {
    // Linear interpolation based on bounding box
    const x = ((lng - MAP_BOUNDS.minLng) / (maxLng_effective - MAP_BOUNDS.minLng)) * 1000;
    // Y-axis is inverted in SVG (0 is top)
    const y = 1000 - (((lat - MAP_BOUNDS.minLat) / (maxLat_effective - MAP_BOUNDS.minLat)) * 1000);
    
    return { x, y };
}

// Internal constants for calculation
const maxLng_effective = MAP_BOUNDS.maxLng;
const maxLat_effective = MAP_BOUNDS.maxLat;

export const hubGeographics: Record<string, GeoCoord & { type: 'backbone' | 'operator', label: string, operators: number, partners: number }> = {
    'Delhi': { lat: 28.6139, lng: 77.2090, type: 'backbone', label: 'Delhi NCR Hub', operators: 4, partners: 6 },
    'Mumbai': { lat: 19.0760, lng: 72.8777, type: 'backbone', label: 'Mumbai Metro Hub', operators: 5, partners: 8 },
    'Bengaluru': { lat: 12.9716, lng: 77.5946, type: 'backbone', label: 'South Zone Hub', operators: 3, partners: 5 },
    'Kolkata': { lat: 22.5726, lng: 88.3639, type: 'backbone', label: 'East Zone Hub', operators: 2, partners: 3 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, type: 'operator', label: 'Hyderabad Tech Hub', operators: 2, partners: 4 },
    'Chennai': { lat: 13.0827, lng: 80.2707, type: 'operator', label: 'Chennai Hub', operators: 2, partners: 3 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, type: 'operator', label: 'West Node', operators: 1, partners: 2 },
    'Jaipur': { lat: 26.9124, lng: 75.7873, type: 'operator', label: 'Heritage Corridor', operators: 1, partners: 4 },
    'Bhopal': { lat: 23.2599, lng: 77.4126, type: 'operator', label: 'Central Node', operators: 1, partners: 1 },
    'Guwahati': { lat: 26.1445, lng: 91.7362, type: 'operator', label: 'NE Gateway', operators: 1, partners: 2 },
    'Cochin': { lat: 9.9312, lng: 76.2673, type: 'operator', label: 'Coastal Node', operators: 1, partners: 3 },
};

// High-fidelity India boundary SVG path including North-East and specific coastal curves
export const indiaPath = "M310,105 L330,85 L350,75 L370,60 L395,45 L420,35 L445,40 L460,60 L470,85 L480,110 L495,125 L510,145 L515,170 L510,195 L525,215 L545,230 L575,240 L605,245 L635,255 L665,275 L695,295 L725,315 L755,335 L785,350 L815,360 L845,375 L875,395 L905,415 L930,440 L945,470 L940,500 L920,525 L890,545 L855,555 L820,565 L785,580 L750,605 L720,635 L700,675 L685,720 L665,770 L640,825 L605,885 L565,945 L520,995 L480,1000 L440,995 L400,945 L360,885 L325,825 L295,770 L270,720 L250,675 L230,635 L205,605 L175,580 L140,565 L100,555 L65,545 L40,525 L20,500 L15,470 L30,440 L60,415 L100,395 L140,375 L180,360 L215,350 L250,335 L285,315 L320,295 L350,275 L380,255 L410,245 L435,240 L460,230 L480,215 L495,195 L505,170 L510,145 L520,125 L530,105 L540,85 L550,70 L570,65 L590,70 L610,80 L630,90 L650,110 L670,135 Z";
