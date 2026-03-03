/**
 * @fileOverview Institutional Geographic Utilities for AeroDesk.
 * Handles precision projection mapping for the India landmass.
 */

export interface GeoCoord {
    lat: number;
    lng: number;
}

export const hubGeographics: Record<string, GeoCoord & { airport: string }> = {
    'Delhi': { lat: 28.6139, lng: 77.2090, airport: 'VIDP' },
    'Mumbai': { lat: 19.0760, lng: 72.8777, airport: 'VABB' },
    'Bengaluru': { lat: 12.9716, lng: 77.5946, airport: 'VOBL' },
    'Kolkata': { lat: 22.5726, lng: 88.3639, airport: 'VECC' },
    'Chennai': { lat: 13.0827, lng: 80.2707, airport: 'VOMM' },
    'Hyderabad': { lat: 17.3850, lng: 78.4867, airport: 'VOHS' },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, airport: 'VAAH' },
    'Pune': { lat: 18.5204, lng: 73.8567, airport: 'VAPO' },
    'Jaipur': { lat: 26.9124, lng: 75.7873, airport: 'VIJP' },
    'Lucknow': { lat: 26.8467, lng: 80.9462, airport: 'VILK' },
    'Chandigarh': { lat: 30.7333, lng: 76.7794, airport: 'VICG' },
    'Goa': { lat: 15.2993, lng: 74.1240, airport: 'VOGO' },
    'Cochin': { lat: 9.9312, lng: 76.2673, airport: 'VOCI' },
    'Bhubaneswar': { lat: 20.3045, lng: 85.8178, airport: 'VEBS' },
    'Bhopal': { lat: 23.2599, lng: 77.4126, airport: 'VABP' },
    'Nagpur': { lat: 21.1458, lng: 79.0882, airport: 'VANP' },
    'Guwahati': { lat: 26.1445, lng: 91.7362, airport: 'VEGT' },
};

/**
 * Geographic Projection Engine
 * Maps India's lat/long bounds to a 1000x1000 SVG viewbox
 */
const MAP_BOUNDS = {
    minLng: 68.0,
    maxLng: 98.0,
    minLat: 6.0,
    maxLat: 38.0
};

export function project(lat: number, lng: number): { x: number; y: number } {
    const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 1000;
    // Y is inverted in SVG
    const y = 1000 - (((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 1000);
    
    // Calibration adjustment for visual alignment with the specific SVG path used
    return { 
        x: x * 0.95 + 25, 
        y: y * 0.95 + 15 
    };
}

export const hubCoordinates = Object.entries(hubGeographics).reduce((acc, [city, coord]) => {
    const { x, y } = project(coord.lat, coord.lng);
    acc[city] = { x, y, airport: coord.airport };
    return acc;
}, {} as Record<string, { x: number; y: number; airport: string }>);

// High-fidelity India boundary SVG path (Simplified for performance)
export const indiaPath = "M435,45 L445,55 L460,50 L475,65 L485,85 L490,110 L505,120 L515,140 L520,165 L515,190 L530,210 L550,225 L580,235 L610,240 L640,250 L670,270 L700,290 L730,310 L760,330 L790,345 L820,355 L850,370 L880,390 L910,410 L935,435 L950,465 L945,495 L925,520 L895,540 L860,550 L825,560 L790,575 L755,600 L725,630 L705,670 L690,715 L670,765 L645,820 L610,880 L570,940 L525,990 L485,1000 L445,990 L405,940 L365,880 L330,820 L300,765 L275,715 L255,670 L235,630 L210,600 L180,575 L145,560 L105,550 L70,540 L45,520 L25,495 L20,465 L35,435 L65,410 L105,390 L145,370 L185,355 L220,345 L255,330 L290,310 L325,290 L355,270 L385,250 L415,240 L440,235 L465,225 L485,210 L500,190 L510,165 L515,140 L525,120 L535,100 L545,80 L555,65 L575,60 L595,65 L615,75 L635,85 L655,105 Z";
