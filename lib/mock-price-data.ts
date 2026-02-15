// Mock Price Data Generator - For price trend charts
// Generates realistic 30-day price history for destinations

export interface PriceDataPoint {
  date: string
  price: number
  priceLabel: string // Formatted for display
}

/**
 * Generate mock historical price data for a destination
 * Creates realistic price fluctuations over 30 days
 */
export function generatePriceHistory(
  currentPrice: number,
  days: number = 30
): PriceDataPoint[] {
  const data: PriceDataPoint[] = []
  const today = new Date()
  
  // Price volatility (±20% from base)
  const basePrice = currentPrice
  const volatility = 0.2
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate realistic price variation using sine wave + random noise
    const trendFactor = Math.sin((i / days) * Math.PI * 2) * 0.1 // Seasonal trend
    const randomFactor = (Math.random() - 0.5) * volatility // Random fluctuation
    const priceFactor = 1 + trendFactor + randomFactor
    
    const price = Math.round(basePrice * priceFactor)
    
    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD
      price,
      priceLabel: `${price} PLN`
    })
  }
  
  // Ensure last point is current price
  data[data.length - 1].price = currentPrice
  data[data.length - 1].priceLabel = `${currentPrice} PLN`
  
  return data
}

/**
 * Get 7-day price trend summary
 */
export function getPriceTrend(priceHistory: PriceDataPoint[]): {
  trend: 'up' | 'down' | 'stable'
  changePercent: number
  changeAmount: number
  recommendation: string
} {
  if (priceHistory.length < 7) {
    return {
      trend: 'stable',
      changePercent: 0,
      changeAmount: 0,
      recommendation: 'Za mało danych'
    }
  }
  
  const last7Days = priceHistory.slice(-7)
  const oldPrice = last7Days[0].price
  const newPrice = last7Days[last7Days.length - 1].price
  
  const changeAmount = newPrice - oldPrice
  const changePercent = Math.round((changeAmount / oldPrice) * 100)
  
  let trend: 'up' | 'down' | 'stable'
  let recommendation: string
  
  if (changePercent > 5) {
    trend = 'up'
    recommendation = 'Ceny rosną - rozważ rezerwację teraz'
  } else if (changePercent < -5) {
    trend = 'down'
    recommendation = 'Ceny spadają - możesz poczekać'
  } else {
    trend = 'stable'
    recommendation = 'Ceny stabilne'
  }
  
  return {
    trend,
    changePercent,
    changeAmount,
    recommendation
  }
}

/**
 * Get min/max/avg price from history
 */
export function getPriceStats(priceHistory: PriceDataPoint[]): {
  min: number
  max: number
  avg: number
  current: number
} {
  const prices = priceHistory.map(p => p.price)
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    current: prices[prices.length - 1]
  }
}

/**
 * Check if current price is a good deal based on history
 */
export function isGoodDeal(currentPrice: number, priceHistory: PriceDataPoint[]): {
  isGoodDeal: boolean
  percentile: number
  message: string
} {
  const prices = priceHistory.map(p => p.price)
  const sortedPrices = [...prices].sort((a, b) => a - b)
  
  // Find percentile of current price
  const position = sortedPrices.findIndex(p => p >= currentPrice)
  const percentile = Math.round((position / sortedPrices.length) * 100)
  
  let isGoodDeal = false
  let message = ''
  
  if (percentile <= 25) {
    isGoodDeal = true
    message = 'Świetna cena! W top 25% najniższych cen.'
  } else if (percentile <= 50) {
    message = 'Dobra cena, poniżej średniej.'
  } else if (percentile <= 75) {
    message = 'Przeciętna cena.'
  } else {
    message = 'Cena wyższa niż zwykle.'
  }
  
  return {
    isGoodDeal,
    percentile,
    message
  }
}

/**
 * Predict price for next 7 days (simple linear projection)
 */
export function predictPrices(priceHistory: PriceDataPoint[]): PriceDataPoint[] {
  if (priceHistory.length < 7) {
    return []
  }
  
  const last7Days = priceHistory.slice(-7)
  const prices = last7Days.map(p => p.price)
  
  // Simple linear regression
  const n = prices.length
  const sumX = prices.reduce((sum, _, i) => sum + i, 0)
  const sumY = prices.reduce((sum, price) => sum + price, 0)
  const sumXY = prices.reduce((sum, price, i) => sum + i * price, 0)
  const sumX2 = prices.reduce((sum, _, i) => sum + i * i, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  const predictions: PriceDataPoint[] = []
  const today = new Date()
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    const predictedPrice = Math.round(intercept + slope * (n + i - 1))
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      price: predictedPrice,
      priceLabel: `${predictedPrice} PLN (prognoza)`
    })
  }
  
  return predictions
}
