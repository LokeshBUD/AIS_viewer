export interface GeoZone {
  id:       string
  name:     string
  north:    number
  south:    number
  east:     number
  west:     number
  severity: 'info' | 'warning'
  risk?:    string   // short label shown in alert message
}

export const GEOZONES: GeoZone[] = [
  // ── High-risk zones ────────────────────────────────────────────────────────
  {
    id: 'hormuz', name: 'Strait of Hormuz',
    north: 26.7, south: 25.8, east: 57.0, west: 56.0,
    severity: 'warning', risk: 'HIGH RISK',
  },
  {
    id: 'bab_el_mandeb', name: 'Bab-el-Mandeb',
    north: 13.0, south: 11.5, east: 43.8, west: 42.8,
    severity: 'warning', risk: 'HIGH RISK',
  },
  {
    id: 'gulf_of_aden', name: 'Gulf of Aden',
    north: 15.0, south: 11.0, east: 52.0, west: 43.0,
    severity: 'warning', risk: 'PIRACY RISK',
  },

  // ── Key chokepoints ────────────────────────────────────────────────────────
  {
    id: 'malacca', name: 'Strait of Malacca',
    north: 6.0, south: 1.0, east: 104.0, west: 99.5,
    severity: 'info',
  },
  {
    id: 'singapore', name: 'Singapore Strait',
    north: 1.4, south: 1.1, east: 104.1, west: 103.6,
    severity: 'info',
  },
  {
    id: 'suez', name: 'Suez Canal Zone',
    north: 31.3, south: 29.9, east: 32.7, west: 32.3,
    severity: 'info',
  },
  {
    id: 'panama', name: 'Panama Canal Zone',
    north: 9.4, south: 8.8, east: -79.4, west: -79.8,
    severity: 'info',
  },
  {
    id: 'dover', name: 'Dover Strait',
    north: 51.5, south: 50.8, east: 2.0, west: -1.0,
    severity: 'info',
  },
  {
    id: 'gibraltar', name: 'Strait of Gibraltar',
    north: 36.2, south: 35.7, east: -5.2, west: -6.1,
    severity: 'info',
  },
  {
    id: 'bosphorus', name: 'Turkish Straits',
    north: 41.3, south: 40.9, east: 29.2, west: 26.0,
    severity: 'info',
  },
  {
    id: 'lombok', name: 'Lombok Strait',
    north: -7.5, south: -8.8, east: 116.1, west: 115.5,
    severity: 'info',
  },
  {
    id: 'good_hope', name: 'Cape of Good Hope',
    north: -33.8, south: -34.6, east: 18.6, west: 18.2,
    severity: 'info',
  },
]

/** Point-in-zone check — simple lat/lon bounds, sufficient for strait-scale polygons */
export function pointInZone(lat: number, lon: number, zone: GeoZone): boolean {
  return lat <= zone.north && lat >= zone.south &&
         lon <= zone.east  && lon >= zone.west
}
