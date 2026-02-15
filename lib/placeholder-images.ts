// Placeholder Image Service - High quality city images for destination cards
// Uses Picsum Photos API for beautiful placeholder images

interface CityImageMapping {
  [key: string]: string
}

// Curated Picsum images for popular destinations
// Format: https://picsum.photos/id/IMAGE_ID/800/600
const cityImages: CityImageMapping = {
  // Popular European destinations
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
  'BCN': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
  
  'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
  'Lisboa': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
  'LIS': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop',
  
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
  'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
  'FCO': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
  
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  'CDG': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  'LHR': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  
  'Berlin': 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=800&h=600&fit=crop',
  'BER': 'https://images.unsplash.com/photo-1560930950-5cc20e80e392?w=800&h=600&fit=crop',
  
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
  'AMS': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
  
  'Prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
  'Praha': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
  'PRG': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
  
  'Vienna': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
  'VIE': 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
  
  'Budapest': 'https://images.unsplash.com/photo-1541368376426-dea33aaee2e1?w=800&h=600&fit=crop',
  'BUD': 'https://images.unsplash.com/photo-1541368376426-dea33aaee2e1?w=800&h=600&fit=crop',
  
  'Athens': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop',
  'ATH': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=600&fit=crop',
  
  'Madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
  'MAD': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
  
  // Popular beach destinations
  'Mallorca': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop',
  'PMI': 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&h=600&fit=crop',
  
  'Ibiza': 'https://images.unsplash.com/photo-1598199604088-6d8e0c0f8cd7?w=800&h=600&fit=crop',
  'IBZ': 'https://images.unsplash.com/photo-1598199604088-6d8e0c0f8cd7?w=800&h=600&fit=crop',
  
  'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  'JTR': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  'DXB': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  
  'Maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
  'MLE': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
  
  // Polish cities
  'Warsaw': 'https://images.unsplash.com/photo-1592308790932-0d29dd0df1e8?w=800&h=600&fit=crop',
  'Warszawa': 'https://images.unsplash.com/photo-1592308790932-0d29dd0df1e8?w=800&h=600&fit=crop',
  'WAW': 'https://images.unsplash.com/photo-1592308790932-0d29dd0df1e8?w=800&h=600&fit=crop',
  
  'Krakow': 'https://images.unsplash.com/photo-1578616070222-a12c7d00ebfa?w=800&h=600&fit=crop',
  'Kraków': 'https://images.unsplash.com/photo-1578616070222-a12c7d00ebfa?w=800&h=600&fit=crop',
  'KRK': 'https://images.unsplash.com/photo-1578616070222-a12c7d00ebfa?w=800&h=600&fit=crop',
  
  'Gdansk': 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=800&h=600&fit=crop',
  'Gdańsk': 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=800&h=600&fit=crop',
  'GDN': 'https://images.unsplash.com/photo-1601823984263-b87b59798b70?w=800&h=600&fit=crop',
  
  // US cities
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'NYC': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'JFK': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  
  'Los Angeles': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
  'LAX': 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=600&fit=crop',
  
  'San Francisco': 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&h=600&fit=crop',
  'SFO': 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&h=600&fit=crop',
  
  // Asian cities
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  'NRT': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
  'SIN': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
  
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
  'BKK': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=600&fit=crop',
}

// Default fallback image - beautiful generic travel scene
const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'

/**
 * Get city image URL for destination card background
 * Supports city names and airport codes (IATA)
 * Returns curated image or generic fallback
 */
export function getCityImage(destination: string): string {
  // Try exact match
  if (cityImages[destination]) {
    return cityImages[destination]
  }
  
  // Try case-insensitive match
  const normalizedDest = destination.trim()
  const match = Object.keys(cityImages).find(
    key => key.toLowerCase() === normalizedDest.toLowerCase()
  )
  
  if (match) {
    return cityImages[match]
  }
  
  // Return default fallback
  return defaultImage
}

/**
 * Get optimized image URL with custom dimensions
 */
export function getCityImageOptimized(
  destination: string,
  width: number = 800,
  height: number = 600
): string {
  const baseUrl = getCityImage(destination)
  
  // If it's Unsplash, we can add params (already in URL)
  // If it's Picsum, modify params
  if (baseUrl.includes('picsum.photos')) {
    const id = baseUrl.match(/id\/(\d+)/)?.[1]
    return `https://picsum.photos/id/${id}/${width}/${height}`
  }
  
  return baseUrl
}

/**
 * Preload image for better UX
 */
export function preloadCityImage(destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = getCityImage(destination)
    img.onload = () => resolve()
    img.onerror = reject
  })
}

/**
 * Get gradient overlay color based on destination
 * Used for card overlay consistency
 */
export function getDestinationGradient(destination: string): string {
  // Hash destination name to get consistent color
  let hash = 0
  for (let i = 0; i < destination.length; i++) {
    hash = destination.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = Math.abs(hash % 360)
  
  return `linear-gradient(180deg, 
    rgba(15, 23, 42, 0) 0%, 
    rgba(15, 23, 42, 0.4) 50%, 
    hsla(${hue}, 50%, 15%, 0.9) 100%
  )`
}
