/**
 * @fileOverview Precision Geographic Assets for AeroDesk Infrastructure.
 * Contains high-fidelity GeoJSON for India Mainland and verified hub coordinates.
 */

export interface GeoCoord {
    lat: number;
    lng: number;
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
 * Validated India Mainland GeoJSON (Simplified for platform performance).
 * Excludes distant islands to maintain mainland scaling focus.
 */
export const indiaGeoJson: any = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "India Mainland" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [68.11, 23.88], [68.21, 23.55], [68.57, 23.33], [68.95, 23.65], [69.25, 22.95], 
          [70.15, 22.65], [70.45, 21.05], [71.85, 20.85], [72.85, 21.15], [72.85, 18.95], 
          [73.35, 16.05], [73.85, 15.45], [74.85, 12.85], [76.25, 9.95], [77.55, 8.05], 
          [78.15, 8.75], [79.85, 10.25], [80.25, 13.05], [81.35, 16.15], [83.35, 17.75], 
          [85.85, 19.75], [87.55, 21.55], [88.35, 22.55], [91.85, 21.85], [92.35, 20.85], 
          [94.15, 23.55], [95.15, 26.95], [97.35, 28.25], [96.15, 29.45], [94.55, 28.55], 
          [91.55, 27.95], [88.55, 27.95], [88.15, 26.55], [85.15, 26.55], [81.15, 30.05], 
          [79.15, 31.05], [78.15, 35.05], [76.15, 37.05], [74.15, 37.05], [73.15, 34.05], 
          [71.15, 31.05], [70.15, 28.05], [69.15, 25.05], [68.11, 23.88]
        ]]
      }
    }
  ]
};