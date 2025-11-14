// Utilitários para geração de gráficos e PDFs

import { CandleData } from './indicators'

// Gerar dados de candlestick simulados (para demonstração)
export function generateCandleData(basePrice: number, count: number = 100): CandleData[] {
  const data: CandleData[] = []
  let currentPrice = basePrice
  const now = Date.now()
  
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * 60000 // 1 minuto por vela
    const volatility = basePrice * 0.002 // 0.2% de volatilidade
    
    const open = currentPrice
    const change = (Math.random() - 0.5) * volatility * 2
    const close = open + change
    
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    const volume = Math.random() * 1000000 + 500000
    
    data.push({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
      volume
    })
    
    currentPrice = close
  }
  
  return data
}

// Formatar preço para exibição
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// Formatar timestamp para hora
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Calcular mudança percentual
export function calculatePercentChange(oldValue: number, newValue: number): number {
  return ((newValue - oldValue) / oldValue) * 100
}

// Identificar suportes e resistências
export function findSupportResistance(data: CandleData[], lookback: number = 20) {
  const supports: number[] = []
  const resistances: number[] = []
  
  for (let i = lookback; i < data.length - lookback; i++) {
    let isSupport = true
    let isResistance = true
    
    for (let j = 1; j <= lookback; j++) {
      if (data[i].low > data[i - j].low || data[i].low > data[i + j].low) {
        isSupport = false
      }
      if (data[i].high < data[i - j].high || data[i].high < data[i + j].high) {
        isResistance = false
      }
    }
    
    if (isSupport) supports.push(data[i].low)
    if (isResistance) resistances.push(data[i].high)
  }
  
  return { supports, resistances }
}

// Gerar explicação de marcadores
export function generateMarkerExplanation(type: 'entry' | 'stop' | 'target', data: {
  price: number
  reason: string
  indicators?: Record<string, number>
}) {
  const explanations = {
    entry: `🎯 Entrada em ${formatPrice(data.price)}\n\n${data.reason}`,
    stop: `🛡️ Stop Loss em ${formatPrice(data.price)}\n\n${data.reason}`,
    target: `🎁 Take Profit em ${formatPrice(data.price)}\n\n${data.reason}`
  }
  
  let explanation = explanations[type]
  
  if (data.indicators) {
    explanation += '\n\nIndicadores:'
    Object.entries(data.indicators).forEach(([key, value]) => {
      explanation += `\n• ${key}: ${value.toFixed(2)}`
    })
  }
  
  return explanation
}

// Calcular risco/retorno
export function calculateRiskReward(entry: number, stop: number, target: number) {
  const risk = Math.abs(entry - stop)
  const reward = Math.abs(target - entry)
  const ratio = reward / risk
  
  return {
    risk,
    reward,
    ratio,
    formatted: `1:${ratio.toFixed(2)}`
  }
}

// Timeframes disponíveis
export const TIMEFRAMES = [
  { value: '1m', label: '1 Minuto', seconds: 60 },
  { value: '5m', label: '5 Minutos', seconds: 300 },
  { value: '15m', label: '15 Minutos', seconds: 900 },
  { value: '30m', label: '30 Minutos', seconds: 1800 },
  { value: '1h', label: '1 Hora', seconds: 3600 },
  { value: '4h', label: '4 Horas', seconds: 14400 },
  { value: '1d', label: '1 Dia', seconds: 86400 }
]

// Cores do tema
export const CHART_COLORS = {
  background: '#0f172a',
  grid: '#1e293b',
  text: '#cbd5e1',
  upColor: '#10b981',
  downColor: '#ef4444',
  borderUpColor: '#10b981',
  borderDownColor: '#ef4444',
  wickUpColor: '#10b981',
  wickDownColor: '#ef4444',
  
  // Indicadores
  rsi: '#8b5cf6',
  macd: '#3b82f6',
  macdSignal: '#f59e0b',
  macdHistogram: '#6366f1',
  bollinger: '#06b6d4',
  ema: '#ec4899',
  sma: '#14b8a6',
  volume: '#64748b'
}
