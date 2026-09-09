// Swiss cities where workshops are offered. Coordinates help local-pack search.
export interface City {
  name: string;
  lat: number;
  lng: number;
}

export const SWISS_CITIES: readonly City[] = [
  { name: 'Zürich', lat: 47.3769, lng: 8.5417 },
  { name: 'Basel', lat: 47.5596, lng: 7.5886 },
  { name: 'Bern', lat: 46.9481, lng: 7.4474 },
  { name: 'Zug', lat: 47.1723, lng: 8.5175 },
  { name: 'Luzern', lat: 47.0502, lng: 8.3093 },
  { name: 'Winterthur', lat: 47.4995, lng: 8.7376 },
  { name: 'St. Gallen', lat: 47.4239, lng: 9.3767 },
  { name: 'Genf', lat: 46.2044, lng: 6.1432 },
  { name: 'Lausanne', lat: 46.5197, lng: 6.6323 },
];

export function findCity(name: string): City | undefined {
  return SWISS_CITIES.find((c) => c.name === name);
}
