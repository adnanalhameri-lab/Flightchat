// Airport Transport Data - Hardcoded for Phase 1
// Will be replaced with real-time API in Phase 2

import { AirportTransport } from './types'

export const AIRPORT_TRANSPORTS: Record<string, AirportTransport> = {
  // SPAIN
  BCN: {
    airportCode: 'BCN',
    airportName: 'Barcelona El Prat',
    options: [
      {
        type: 'Aerobus',
        price: '5.90 EUR (~26 PLN)',
        duration: '35 min',
        frequency: 'co 5-10 min',
        recommendation: 'Najszybsza i najtańsza opcja - bezpośredni kurs do centrum',
      },
      {
        type: 'Metro L9',
        price: '5.15 EUR (~23 PLN)',
        duration: '45 min',
        frequency: 'co 7 min',
        recommendation: 'Budżetowa opcja, możliwość przesiadek',
      },
      {
        type: 'Taxi',
        price: '30-40 EUR (~135-180 PLN)',
        duration: '20-30 min',
        recommendation: 'Najwygodniejsza, dobra dla 3-4 osób',
      },
      {
        type: 'Uber/Bolt',
        price: '25-35 EUR (~110-155 PLN)',
        duration: '20-30 min',
      },
    ],
  },

  MAD: {
    airportCode: 'MAD',
    airportName: 'Madrid Barajas',
    options: [
      {
        type: 'Metro',
        price: '5 EUR (~22 PLN)',
        duration: '30-40 min',
        frequency: 'co 5 min',
        recommendation: 'Najtańsza opcja z przesiadkami',
      },
      {
        type: 'Express Bus 203',
        price: '5 EUR (~22 PLN)',
        duration: '40 min',
        frequency: 'co 15 min',
        recommendation: 'Bezpośredni kurs, wygodny',
      },
      {
        type: 'Taxi',
        price: '30 EUR (~135 PLN)',
        duration: '20-30 min',
        recommendation: 'Stała cena do centrum',
      },
    ],
  },

  // PORTUGAL
  LIS: {
    airportCode: 'LIS',
    airportName: 'Lisbon Portela',
    options: [
      {
        type: 'Metro (Linha Vermelha)',
        price: '1.50 EUR (~7 PLN)',
        duration: '25 min',
        frequency: 'co 6-9 min',
        recommendation: 'Najtańsza opcja, bezpośredni kurs',
      },
      {
        type: 'Aerobus',
        price: '4 EUR (~18 PLN)',
        duration: '30-40 min',
        frequency: 'co 20 min',
        recommendation: 'Wygodny z bagażem',
      },
      {
        type: 'Taxi/Uber',
        price: '15-20 EUR (~65-90 PLN)',
        duration: '15-25 min',
        recommendation: 'Dobra cena za wygodę',
      },
    ],
  },

  // ITALY
  FCO: {
    airportCode: 'FCO',
    airportName: 'Rome Fiumicino',
    options: [
      {
        type: 'Leonardo Express',
        price: '14 EUR (~62 PLN)',
        duration: '32 min',
        frequency: 'co 15-30 min',
        recommendation: 'Najszybszy pociąg do centrum',
      },
      {
        type: 'Pociąg regionalny',
        price: '8 EUR (~35 PLN)',
        duration: '45 min',
        frequency: 'co 15-30 min',
      },
      {
        type: 'Taxi',
        price: '48 EUR stała cena (~215 PLN)',
        duration: '30-50 min',
        recommendation: 'Stała cena do centrum',
      },
    ],
  },

  // FRANCE
  CDG: {
    airportCode: 'CDG',
    airportName: 'Paris Charles de Gaulle',
    options: [
      {
        type: 'RER B',
        price: '11.45 EUR (~51 PLN)',
        duration: '30-40 min',
        frequency: 'co 10-15 min',
        recommendation: 'Najtańsza opcja do centrum',
      },
      {
        type: 'Roissybus',
        price: '16.60 EUR (~74 PLN)',
        duration: '60 min',
        frequency: 'co 15-20 min',
      },
      {
        type: 'Taxi',
        price: '50-55 EUR (~220-245 PLN)',
        duration: '30-50 min',
        recommendation: 'Stała cena, wygodnie',
      },
    ],
  },

  // UK
  LHR: {
    airportCode: 'LHR',
    airportName: 'London Heathrow',
    options: [
      {
        type: 'Heathrow Express',
        price: '25 GBP (~130 PLN)',
        duration: '15 min',
        frequency: 'co 15 min',
        recommendation: 'Najszybszy do centrum',
      },
      {
        type: 'Elizabeth Line',
        price: '12.80 GBP (~66 PLN)',
        duration: '30 min',
        frequency: 'co 5 min',
        recommendation: 'Dobry stosunek ceny do czasu',
      },
      {
        type: 'Metro (Piccadilly Line)',
        price: '5.50 GBP (~29 PLN)',
        duration: '50 min',
        frequency: 'co 5-10 min',
        recommendation: 'Najtańsza opcja',
      },
      {
        type: 'Taxi',
        price: '60-90 GBP (~310-465 PLN)',
        duration: '40-70 min',
      },
    ],
  },

  // NETHERLANDS
  AMS: {
    airportCode: 'AMS',
    airportName: 'Amsterdam Schiphol',
    options: [
      {
        type: 'Pociąg do Centraal',
        price: '5.50 EUR (~24 PLN)',
        duration: '15-20 min',
        frequency: 'co 10-15 min',
        recommendation: 'Najlepszy wybór - szybko i tanio',
      },
      {
        type: 'Bus 397',
        price: '6.50 EUR (~29 PLN)',
        duration: '30 min',
        frequency: 'co 10 min',
      },
      {
        type: 'Taxi',
        price: '40-50 EUR (~180-225 PLN)',
        duration: '20-30 min',
      },
    ],
  },

  // GERMANY
  BER: {
    airportCode: 'BER',
    airportName: 'Berlin Brandenburg',
    options: [
      {
        type: 'Airport Express (FEX)',
        price: '3.80 EUR (~17 PLN)',
        duration: '30 min',
        frequency: 'co 30 min',
        recommendation: 'Najszybsza opcja',
      },
      {
        type: 'S-Bahn S9/S45',
        price: '3.80 EUR (~17 PLN)',
        duration: '45 min',
        frequency: 'co 20 min',
        recommendation: 'Tania i wygodna',
      },
      {
        type: 'Taxi/Uber',
        price: '45-55 EUR (~200-245 PLN)',
        duration: '30-40 min',
      },
    ],
  },

  // GREECE
  ATH: {
    airportCode: 'ATH',
    airportName: 'Athens International',
    options: [
      {
        type: 'Metro Linia 3',
        price: '9 EUR (~40 PLN)',
        duration: '40 min',
        frequency: 'co 30 min',
        recommendation: 'Najlepsza opcja do centrum',
      },
      {
        type: 'Express Bus X95',
        price: '5.50 EUR (~24 PLN)',
        duration: '60 min',
        frequency: 'co 20 min',
      },
      {
        type: 'Taxi',
        price: '38 EUR (~170 PLN)',
        duration: '30-50 min',
        recommendation: 'Stała cena w dzień',
      },
    ],
  },

  // CZECH REPUBLIC
  PRG: {
    airportCode: 'PRG',
    airportName: 'Prague Václav Havel',
    options: [
      {
        type: 'Airport Express',
        price: '60 CZK (~11 PLN)',
        duration: '35 min',
        frequency: 'co 30 min',
        recommendation: 'Szybki i wygodny',
      },
      {
        type: 'Public Bus + Metro',
        price: '40 CZK (~7 PLN)',
        duration: '45-60 min',
        frequency: 'co 10-15 min',
        recommendation: 'Najtańsza opcja',
      },
      {
        type: 'Taxi',
        price: '600-800 CZK (~110-145 PLN)',
        duration: '25-35 min',
      },
    ],
  },

  // POLAND
  WAW: {
    airportCode: 'WAW',
    airportName: 'Warsaw Chopin',
    options: [
      {
        type: 'Pociąg SKM',
        price: '4.40 PLN',
        duration: '25 min',
        frequency: 'co 15 min',
        recommendation: 'Najszybsza i najtańsza do centrum',
      },
      {
        type: 'Autobus 175/188',
        price: '4.40 PLN',
        duration: '30-40 min',
        frequency: 'co 10-15 min',
      },
      {
        type: 'Taxi',
        price: '40-60 PLN',
        duration: '20-30 min',
        recommendation: 'Stała cena, wygodnie',
      },
      {
        type: 'Uber/Bolt',
        price: '35-50 PLN',
        duration: '20-30 min',
      },
    ],
  },

  KRK: {
    airportCode: 'KRK',
    airportName: 'Krakow Balice',
    options: [
      {
        type: 'Pociąg do Głównego',
        price: '9 PLN',
        duration: '17 min',
        frequency: 'co 30 min',
        recommendation: 'Najszybsza opcja',
      },
      {
        type: 'Autobus 208/209',
        price: '4.40 PLN',
        duration: '40-50 min',
        frequency: 'co 15-20 min',
      },
      {
        type: 'Taxi',
        price: '90-110 PLN',
        duration: '20-30 min',
      },
    ],
  },

  GDN: {
    airportCode: 'GDN',
    airportName: 'Gdansk Lech Walesa',
    options: [
      {
        type: 'Pociąg SKM',
        price: '4.40 PLN',
        duration: '30 min',
        frequency: 'co 30 min',
        recommendation: 'Najlepsza opcja',
      },
      {
        type: 'Autobus 210',
        price: '4.40 PLN',
        duration: '40 min',
        frequency: 'co 30 min',
      },
      {
        type: 'Taxi',
        price: '60-80 PLN',
        duration: '20-25 min',
      },
    ],
  },
}

// Helper function to get transport data
export function getAirportTransport(iataCode: string): AirportTransport | null {
  return AIRPORT_TRANSPORTS[iataCode] || null
}

// Get all available airport codes
export function getAvailableAirports(): string[] {
  return Object.keys(AIRPORT_TRANSPORTS)
}
