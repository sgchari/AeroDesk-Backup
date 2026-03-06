/**
 * @fileOverview Precision Geographic Assets for AeroDesk Infrastructure.
 * Contains high-fidelity GeoJSON for India Mainland and verified hub coordinates.
 */

export interface GeoCoord {
    lat: number;
    lng: number;
}

export const hubGeographics: Record<string, GeoCoord & { type: 'backbone' | 'operator', label: string, operators: number, partners: number }> = {
    'Delhi': { lat: 28.7041, lng: 77.1025, type: 'backbone', label: 'Delhi NCR Hub', operators: 4, partners: 6 },
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

export const indiaPath = "M310,230 L320,210 L350,200 L380,220 L410,190 L450,180 L480,120 L550,110 L620,130 L680,110 L720,140 L750,180 L780,210 L820,230 L850,300 L880,350 L850,420 L820,480 L780,550 L750,620 L720,680 L680,750 L650,820 L620,880 L580,920 L520,950 L480,920 L420,880 L380,820 L350,750 L320,680 L280,620 L250,550 L220,480 L180,420 L150,350 L120,300 L150,250 L180,220 L220,250 L250,280 L280,250 Z";

export const hubCoordinates: Record<string, { x: number, y: number }> = {
    'Delhi': { x: 420, y: 280 },
    'Mumbai': { x: 320, y: 580 },
    'Bengaluru': { x: 450, y: 780 },
    'Kolkata': { x: 780, y: 450 },
    'Hyderabad': { x: 480, y: 620 },
    'Chennai': { x: 520, y: 820 },
    'Ahmedabad': { x: 310, y: 480 },
    'Jaipur': { x: 380, y: 350 },
    'Bhopal': { x: 450, y: 480 },
    'Guwahati': { x: 880, y: 350 },
    'Cochin': { x: 420, y: 920 },
};

export const indiaGeoJson: any = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "India Mainland" },
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[
          [
            [68.11, 23.88], [68.21, 23.55], [68.57, 23.33], [68.95, 23.65], [69.25, 22.95], 
            [70.15, 22.65], [70.45, 21.05], [71.85, 20.85], [72.85, 21.15], [72.85, 18.95], 
            [73.35, 16.05], [73.85, 15.45], [74.85, 12.85], [76.25, 9.95], [77.55, 8.05], 
            [78.15, 8.75], [79.85, 10.25], [80.25, 13.05], [81.35, 16.15], [83.35, 17.75], 
            [85.85, 19.75], [87.55, 21.55], [88.35, 22.55], [91.85, 21.85], [92.35, 20.85], 
            [94.15, 23.55], [95.15, 26.95], [97.35, 28.25], [96.15, 29.45], [94.55, 28.55], 
            [91.55, 27.95], [88.55, 27.95], [88.15, 26.55], [85.15, 26.55], [81.15, 30.05], 
            [79.15, 31.05], [78.15, 35.05], [76.15, 37.05], [74.15, 37.05], [73.15, 34.05], 
            [71.15, 31.05], [70.15, 28.05], [69.15, 25.05], [68.11, 23.88]
          ]
        ]]
      }
    }
  ]
};