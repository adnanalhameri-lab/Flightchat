// Utility Functions for FlightChat

import { type ClassValue, clsx } from 'clsx'

// Tailwind CSS class merging (if needed)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// IATA code to city name mapping
export const IATA_TO_CITY: Record<string, string> = {
  // Poland
  WAW: 'Warszawa',
  KRK: 'Kraków',
  GDN: 'Gdańsk',
  KTW: 'Katowice',
  WMI: 'Warszawa Modlin',
  WRO: 'Wrocław',
  POZ: 'Poznań',
  RZE: 'Rzeszów',
  
  // Spain
  BCN: 'Barcelona',
  MAD: 'Madryt',
  AGP: 'Malaga',
  PMI: 'Palma de Mallorca',
  SVQ: 'Sewilla',
  VLC: 'Walencja',
  ALC: 'Alicante',
  
  // Portugal
  LIS: 'Lizbona',
  OPO: 'Porto',
  FAO: 'Faro',
  
  // Italy
  FCO: 'Rzym',
  MXP: 'Mediolan',
  VCE: 'Wenecja',
  NAP: 'Neapol',
  BGY: 'Bergamo',
  BLQ: 'Bolonia',
  
  // France
  CDG: 'Paryż',
  ORY: 'Paryż Orly',
  NCE: 'Nicea',
  LYS: 'Lyon',
  MRS: 'Marsylia',
  
  // UK
  LHR: 'Londyn',
  LGW: 'Londyn Gatwick',
  STN: 'Londyn Stansted',
  LTN: 'Londyn Luton',
  MAN: 'Manchester',
  EDI: 'Edynburg',
  
  // Netherlands
  AMS: 'Amsterdam',
  EIN: 'Eindhoven',
  RTM: 'Rotterdam',
  
  // Germany
  BER: 'Berlin',
  MUC: 'Monachium',
  FRA: 'Frankfurt',
  DUS: 'Düsseldorf',
  HAM: 'Hamburg',
  CGN: 'Kolonia',
  
  // Greece
  ATH: 'Ateny',
  HER: 'Heraklion',
  RHO: 'Rodos',
  SKG: 'Saloniki',
  
  // Czech Republic
  PRG: 'Praga',
  
  // Austria
  VIE: 'Wiedeń',
  SZG: 'Salzburg',
  
  // Hungary
  BUD: 'Budapeszt',
  
  // Ireland
  DUB: 'Dublin',
  
  // Belgium
  BRU: 'Bruksela',
  CRL: 'Bruksela Charleroi',
  
  // Denmark
  CPH: 'Kopenhaga',
  
  // Sweden
  ARN: 'Sztokholm',
  GOT: 'Göteborg',
  
  // Norway
  OSL: 'Oslo',
  BGO: 'Bergen',
  
  // Croatia
  ZAG: 'Zagrzeb',
  SPU: 'Split',
  DBV: 'Dubrownik',
  
  // Switzerland
  ZRH: 'Zurych',
  GVA: 'Genewa',
}

// Get city name from IATA code
export function getCityName(iataCode: string): string {
  return IATA_TO_CITY[iataCode] || iataCode
}

// IATA code to coordinates (for APIs that need lat/lon)
export const IATA_TO_COORDS: Record<string, { lat: number; lon: number }> = {
  WAW: { lat: 52.2297, lon: 21.0122 },
  KRK: { lat: 50.0647, lon: 19.9450 },
  GDN: { lat: 54.3520, lon: 18.6466 },
  BCN: { lat: 41.3874, lon: 2.1686 },
  LIS: { lat: 38.7223, lon: -9.1393 },
  MAD: { lat: 40.4168, lon: -3.7038 },
  FCO: { lat: 41.9028, lon: 12.4964 },
  CDG: { lat: 48.8566, lon: 2.3522 },
  LHR: { lat: 51.5074, lon: -0.1278 },
  AMS: { lat: 52.3676, lon: 4.9041 },
  BER: { lat: 52.5200, lon: 13.4050 },
  ATH: { lat: 37.9838, lon: 23.7275 },
  PRG: { lat: 50.0755, lon: 14.4378 },
  DUB: { lat: 53.3498, lon: -6.2603 },
  VIE: { lat: 48.2082, lon: 16.3738 },
  BUD: { lat: 47.4979, lon: 19.0402 },
  MXP: { lat: 45.4642, lon: 9.1900 },
  VCE: { lat: 45.4408, lon: 12.3155 },
  ZRH: { lat: 47.3769, lon: 8.5417 },
  CPH: { lat: 55.6761, lon: 12.5683 },
  OSL: { lat: 59.9139, lon: 10.7522 },
}

// Get coordinates from IATA code
export function getCoordinates(iataCode: string): { lat: number; lon: number } {
  return IATA_TO_COORDS[iataCode] || { lat: 0, lon: 0 }
}

// Format date for display (Polish locale)
export function formatDate(date: string | Date, locale: 'pl' | 'en' = 'pl'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (locale === 'pl') {
    return d.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }
  
  return d.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'PLN'): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Parse date string to YYYY-MM-DD
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Weather icon to emoji
export function getWeatherEmoji(icon: string): string {
  if (icon.startsWith('01')) return '☀️'
  if (icon.startsWith('02')) return '⛅'
  if (icon.startsWith('03') || icon.startsWith('04')) return '☁️'
  if (icon.startsWith('09') || icon.startsWith('10')) return '🌧️'
  if (icon.startsWith('11')) return '⛈️'
  if (icon.startsWith('13')) return '❄️'
  if (icon.startsWith('50')) return '🌫️'
  return '🌤️'
}

// Validate IATA code
export function isValidIataCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code) && code in IATA_TO_CITY
}

// Validate date (not in the past)
export function isValidFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

// Calculate days between dates
export function daysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
