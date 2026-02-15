// Price Chart Component - Shows price trends using Recharts

'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { PriceDataPoint } from '@/lib/mock-price-data'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface PriceChartProps {
  data: PriceDataPoint[]
  currentPrice: number
  currency?: string
}

export function PriceChart({ data, currentPrice, currency = 'PLN' }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-white/70">
        <p className="text-sm">Brak danych cenowych</p>
      </div>
    )
  }

  // Calculate price trend
  const firstPrice = data[0].price
  const lastPrice = data[data.length - 1].price
  const priceDiff = lastPrice - firstPrice
  const priceChange = Math.round((priceDiff / firstPrice) * 100)
  
  const trend = priceChange > 5 ? 'up' : priceChange < -5 ? 'down' : 'stable'

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-blue-900/95 backdrop-blur-md border border-blue-700 rounded-lg px-4 py-2 shadow-xl">
          <p className="text-xs text-white/70 mb-1">
            {new Date(data.date).toLocaleDateString('pl-PL', {
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-sm font-bold text-white">
            {data.price} {currency}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-3">
      {/* Trend indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <div className="p-1.5 rounded-lg bg-error/20">
                <TrendingUp className="w-4 h-4 text-error" />
              </div>
              <div>
                <p className="text-xs text-white/70">Trend cenowy</p>
                <p className="text-sm font-semibold text-error">
                  +{priceChange}% (ostatnie 30 dni)
                </p>
              </div>
            </>
          )}
          
          {trend === 'down' && (
            <>
              <div className="p-1.5 rounded-lg bg-success/20">
                <TrendingDown className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-white/70">Trend cenowy</p>
                <p className="text-sm font-semibold text-success">
                  {priceChange}% (ostatnie 30 dni)
                </p>
              </div>
            </>
          )}
          
          {trend === 'stable' && (
            <>
              <div className="p-1.5 rounded-lg bg-blue-500/20">
                <Minus className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-white/70">Trend cenowy</p>
                <p className="text-sm font-semibold text-white">
                  Stabilne ceny
                </p>
              </div>
            </>
          )}
        </div>

        {/* Current price badge */}
        <div className="text-right">
          <p className="text-xs text-white/70">Aktualna cena</p>
          <p className="text-lg font-bold text-white">{currentPrice} {currency}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-40 -mx-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="date"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.getDate().toString()
              }}
              stroke="rgba(255,255,255,0.1)"
            />
            
            <YAxis 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
              stroke="rgba(255,255,255,0.1)"
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#priceGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Price stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-white/70">Minimum</p>
          <p className="text-sm font-semibold text-success">
            {Math.min(...data.map(d => d.price))} {currency}
          </p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-white/70">Średnia</p>
          <p className="text-sm font-semibold text-white">
            {Math.round(data.reduce((sum, d) => sum + d.price, 0) / data.length)} {currency}
          </p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-xs text-white/70">Maksimum</p>
          <p className="text-sm font-semibold text-error">
            {Math.max(...data.map(d => d.price))} {currency}
          </p>
        </div>
      </div>
    </div>
  )
}
