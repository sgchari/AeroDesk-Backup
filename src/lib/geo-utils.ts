/**
 * @fileOverview Institutional Geographic Utilities for AeroDesk.
 * Handles calibrated projection for the actual India Map silhouette.
 */

export const hubGeographics: Record<string, { lat: number; lng: number; airport: string }> = {
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
 * Manual Alignment Engine for High-Fidelity India Map
 * Coordinates calibrated for a 1000x1000 SVG viewbox
 */
export const manualHubCoordinates: Record<string, { x: number; y: number }> = {
    'Delhi': { x: 485, y: 260 },
    'Mumbai': { x: 385, y: 580 },
    'Kolkata': { x: 785, y: 480 },
    'Bengaluru': { x: 485, y: 800 },
    'Chennai': { x: 565, y: 800 },
    'Hyderabad': { x: 525, y: 620 },
    'Ahmedabad': { x: 385, y: 450 },
    'Jaipur': { x: 445, y: 350 },
    'Lucknow': { x: 565, y: 350 },
    'Chandigarh': { x: 485, y: 200 },
    'Bhopal': { x: 505, y: 480 },
    'Pune': { x: 415, y: 620 },
    'Nagpur': { x: 565, y: 500 },
    'Guwahati': { x: 885, y: 350 },
    'Bhubaneswar': { x: 725, y: 550 },
    'Goa': { x: 415, y: 720 },
    'Cochin': { x: 485, y: 900 },
};

export const hubCoordinates = Object.entries(hubGeographics).reduce((acc, [city, data]) => {
    acc[city] = { 
        ...(manualHubCoordinates[city] || { x: 500, y: 500 }), 
        airport: data.airport 
    };
    return acc;
}, {} as Record<string, { x: number; y: number; airport: string }>);

export const indiaPath = "M310,105 L330,85 L350,75 L370,65 L390,60 L410,65 L420,80 L425,100 L435,120 L445,140 L450,160 L460,180 L475,200 L490,215 L510,225 L535,230 L560,235 L590,245 L620,260 L650,275 L685,295 L720,315 L755,330 L790,340 L830,355 L870,375 L910,395 L940,420 L955,450 L950,485 L930,515 L900,535 L860,545 L820,555 L780,570 L745,595 L715,625 L695,665 L680,710 L660,760 L635,815 L600,875 L560,935 L515,985 L475,995 L435,985 L395,935 L355,875 L320,815 L290,760 L265,710 L245,665 L225,625 L200,595 L170,570 L135,555 L95,545 L60,535 L35,515 L15,485 L10,450 L25,420 L55,395 L95,375 L135,355 L175,340 L210,330 L245,315 L280,295 L315,275 L345,260 L375,245 L405,235 L430,230 L455,225 L475,215 L490,200 L505,180 L515,160 L520,140 L530,120 L540,100 L545,80 L555,65 L575,60 L595,65 L615,75 L635,85 L655,105 Z";
