/**
 * @fileOverview Precision Geographic Utilities for AeroDesk.
 * Handles high-fidelity projection mapping for the Indian landmass.
 */

export interface GeoCoord {
    lat: number;
    lng: number;
}

/**
 * Precision Bounding Box for the Indian Subcontinent (Mainland + standard buffers)
 * West: 68.1°E (Gujarat) | East: 97.4°E (Arunachal)
 * South: 8.0°N (Kanyakumari) | North: 37.5°N (Ladakh)
 */
const MAP_BOUNDS = {
    minLng: 68.1,
    maxLng: 97.4,
    minLat: 8.0,
    maxLat: 37.5
};

/**
 * Geographic Projection Engine
 * Maps real-world [longitude, latitude] to a calibrated 1000x1000 SVG coordinate space.
 * Uses a linear mapping calibrated to the India silhouette path.
 */
export function project(lat: number, lng: number): { x: number; y: number } {
    // Horizontal mapping (Longitudinal)
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 1000;
    
    // Vertical mapping (Latitudinal) - Inverted for SVG Y-axis
    const y = 1000 - (((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 1000);
    
    return { x, y };
}

export const hubGeographics: Record<string, GeoCoord & { type: 'backbone' | 'operator', label: string, operators: number, partners: number }> = {
    'Delhi': { lat: 28.6139, lng: 77.2090, type: 'backbone', label: 'Delhi NCR Hub', operators: 4, partners: 6 },
    'Mumbai': { lat: 19.0760, lng: 72.8777, type: 'backbone', label: 'Mumbai Metro Hub', operators: 5, partners: 8 },
    'Bengaluru': { lat: 12.9716, lng: 77.5946, type: 'backbone', label: 'South Zone Hub', operators: 3, partners: 5 },
    'Kolkata': { lat: 22.5726, lng: 88.3639, type: 'backbone', label: 'East Zone Hub', operators: 2, partners: 3 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, type: 'backbone', label: 'Hyderabad Tech Hub', operators: 2, partners: 4 },
    'Chennai': { lat: 13.0827, lng: 80.2707, type: 'backbone', label: 'Chennai Port Hub', operators: 2, partners: 3 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, type: 'operator', label: 'Gujarat Sector', operators: 1, partners: 2 },
    'Jaipur': { lat: 26.9124, lng: 75.7873, type: 'operator', label: 'Heritage Corridor', operators: 1, partners: 4 },
    'Bhopal': { lat: 23.2599, lng: 77.4126, type: 'operator', label: 'Central Grid', operators: 1, partners: 1 },
    'Guwahati': { lat: 26.1445, lng: 91.7362, type: 'operator', label: 'NE Gateway', operators: 1, partners: 2 },
    'Cochin': { lat: 9.9312, lng: 76.2673, type: 'operator', label: 'Coastal Corridor', operators: 1, partners: 3 },
};

/**
 * High-resolution India boundary silhouette.
 * Calibrated for the 1000x1000 viewbox matching MAP_BOUNDS.
 */
export const indiaPath = "M310,105 L335,85 L360,75 L380,60 L410,45 L440,35 L470,40 L490,60 L505,85 L515,110 L530,125 L550,145 L560,170 L550,195 L570,215 L590,230 L620,240 L650,245 L680,255 L710,275 L740,295 L770,315 L800,335 L830,350 L860,360 L890,375 L920,395 L950,415 L975,440 L985,470 L980,500 L960,525 L930,545 L895,555 L860,565 L825,580 L790,605 L760,635 L740,675 L725,720 L705,770 L680,825 L645,885 L605,945 L560,995 L520,1000 L480,995 L440,945 L400,885 L365,825 L335,770 L310,720 L290,675 L270,635 L245,605 L215,580 L180,565 L140,555 L105,545 L80,525 L60,500 L55,470 L70,440 L100,415 L140,395 L180,375 L220,360 L255,350 L290,335 L325,315 L360,295 L390,275 L420,255 L450,245 L475,240 L500,230 L520,215 L535,195 L545,170 L550,145 L560,125 L570,105 L580,85 L590,70 L610,65 L630,70 L650,80 L670,90 L690,110 L710,135 Z";
