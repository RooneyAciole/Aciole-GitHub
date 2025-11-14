// Biblioteca de Indicadores Técnicos Profissionais

export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

// RSI (Relative Strength Index)
export function calculateRSI(data: CandleData[], period: number = 14): number[] {
  if (data.length < period + 1) return []
  
  const rsi: number[] = []
  let gains = 0
  let losses = 0
  
  // Primeira média
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }
  
  let avgGain = gains / period
  let avgLoss = losses / period
  
  for (let i = period; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close
    
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period
    }
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsiValue = 100 - (100 / (1 + rs))
    rsi.push(rsiValue)
  }
  
  return rsi
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(data: CandleData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const emaFast = calculateEMA(data.map(d => d.close), fastPeriod)
  const emaSlow = calculateEMA(data.map(d => d.close), slowPeriod)
  
  const macdLine: number[] = []
  for (let i = 0; i < Math.min(emaFast.length, emaSlow.length); i++) {
    macdLine.push(emaFast[i] - emaSlow[i])
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod)
  const histogram: number[] = []
  
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + (macdLine.length - signalLine.length)] - signalLine[i])
  }
  
  return { macdLine, signalLine, histogram }
}

// EMA (Exponential Moving Average)
export function calculateEMA(data: number[], period: number): number[] {
  if (data.length < period) return []
  
  const ema: number[] = []
  const multiplier = 2 / (period + 1)
  
  // Primeira EMA é uma SMA
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i]
  }
  ema.push(sum / period)
  
  // Calcular EMA subsequentes
  for (let i = period; i < data.length; i++) {
    const value = (data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
    ema.push(value)
  }
  
  return ema
}

// SMA (Simple Moving Average)
export function calculateSMA(data: number[], period: number): number[] {
  if (data.length < period) return []
  
  const sma: number[] = []
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j]
    }
    sma.push(sum / period)
  }
  
  return sma
}

// Bandas de Bollinger
export function calculateBollingerBands(data: CandleData[], period: number = 20, stdDev: number = 2) {
  const closes = data.map(d => d.close)
  const sma = calculateSMA(closes, period)
  
  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []
  
  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1
    let sum = 0
    
    for (let j = 0; j < period; j++) {
      sum += Math.pow(closes[dataIndex - j] - sma[i], 2)
    }
    
    const std = Math.sqrt(sum / period)
    
    middle.push(sma[i])
    upper.push(sma[i] + stdDev * std)
    lower.push(sma[i] - stdDev * std)
  }
  
  return { upper, middle, lower }
}

// ATR (Average True Range)
export function calculateATR(data: CandleData[], period: number = 14): number[] {
  if (data.length < period + 1) return []
  
  const trueRanges: number[] = []
  
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high
    const low = data[i].low
    const prevClose = data[i - 1].close
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    )
    
    trueRanges.push(tr)
  }
  
  const atr: number[] = []
  let sum = 0
  
  for (let i = 0; i < period; i++) {
    sum += trueRanges[i]
  }
  atr.push(sum / period)
  
  for (let i = period; i < trueRanges.length; i++) {
    const value = (atr[atr.length - 1] * (period - 1) + trueRanges[i]) / period
    atr.push(value)
  }
  
  return atr
}

// Oscilador Estocástico
export function calculateStochastic(data: CandleData[], kPeriod: number = 14, dPeriod: number = 3) {
  const kLine: number[] = []
  
  for (let i = kPeriod - 1; i < data.length; i++) {
    let highest = -Infinity
    let lowest = Infinity
    
    for (let j = 0; j < kPeriod; j++) {
      const candle = data[i - j]
      highest = Math.max(highest, candle.high)
      lowest = Math.min(lowest, candle.low)
    }
    
    const current = data[i].close
    const k = ((current - lowest) / (highest - lowest)) * 100
    kLine.push(k)
  }
  
  const dLine = calculateSMA(kLine, dPeriod)
  
  return { kLine, dLine }
}

// ADX (Average Directional Index)
export function calculateADX(data: CandleData[], period: number = 14): number[] {
  if (data.length < period + 1) return []
  
  const plusDM: number[] = []
  const minusDM: number[] = []
  const tr: number[] = []
  
  for (let i = 1; i < data.length; i++) {
    const highDiff = data[i].high - data[i - 1].high
    const lowDiff = data[i - 1].low - data[i].low
    
    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0)
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0)
    
    const trValue = Math.max(
      data[i].high - data[i].low,
      Math.abs(data[i].high - data[i - 1].close),
      Math.abs(data[i].low - data[i - 1].close)
    )
    tr.push(trValue)
  }
  
  const smoothedPlusDM = calculateEMA(plusDM, period)
  const smoothedMinusDM = calculateEMA(minusDM, period)
  const smoothedTR = calculateEMA(tr, period)
  
  const adx: number[] = []
  
  for (let i = 0; i < smoothedTR.length; i++) {
    const plusDI = (smoothedPlusDM[i] / smoothedTR[i]) * 100
    const minusDI = (smoothedMinusDM[i] / smoothedTR[i]) * 100
    const dx = (Math.abs(plusDI - minusDI) / (plusDI + minusDI)) * 100
    adx.push(dx)
  }
  
  return calculateEMA(adx, period)
}

// VWAP (Volume Weighted Average Price)
export function calculateVWAP(data: CandleData[]): number[] {
  const vwap: number[] = []
  let cumulativeTPV = 0
  let cumulativeVolume = 0
  
  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    const volume = data[i].volume || 1
    
    cumulativeTPV += typicalPrice * volume
    cumulativeVolume += volume
    
    vwap.push(cumulativeTPV / cumulativeVolume)
  }
  
  return vwap
}

// Detectar padrões de candlestick
export function detectCandlePatterns(data: CandleData[]) {
  const patterns: Array<{
    index: number
    pattern: string
    signal: 'bullish' | 'bearish'
    description: string
  }> = []
  
  for (let i = 2; i < data.length; i++) {
    const current = data[i]
    const prev = data[i - 1]
    const prev2 = data[i - 2]
    
    const currentBody = Math.abs(current.close - current.open)
    const prevBody = Math.abs(prev.close - prev.open)
    
    // Engolfo de Alta
    if (prev.close < prev.open && current.close > current.open &&
        current.open < prev.close && current.close > prev.open) {
      patterns.push({
        index: i,
        pattern: 'Bullish Engulfing',
        signal: 'bullish',
        description: 'Vela verde engole vela vermelha anterior - forte sinal de alta'
      })
    }
    
    // Engolfo de Baixa
    if (prev.close > prev.open && current.close < current.open &&
        current.open > prev.close && current.close < prev.open) {
      patterns.push({
        index: i,
        pattern: 'Bearish Engulfing',
        signal: 'bearish',
        description: 'Vela vermelha engole vela verde anterior - forte sinal de baixa'
      })
    }
    
    // Martelo
    const lowerShadow = current.close > current.open ? 
      current.open - current.low : current.close - current.low
    const upperShadow = current.close > current.open ?
      current.high - current.close : current.high - current.open
    
    if (lowerShadow > currentBody * 2 && upperShadow < currentBody * 0.3) {
      patterns.push({
        index: i,
        pattern: 'Hammer',
        signal: 'bullish',
        description: 'Martelo - possível reversão de alta'
      })
    }
    
    // Doji
    if (currentBody < (current.high - current.low) * 0.1) {
      patterns.push({
        index: i,
        pattern: 'Doji',
        signal: 'bullish',
        description: 'Doji - indecisão do mercado, possível reversão'
      })
    }
  }
  
  return patterns
}

// Análise de divergência
export function detectDivergence(prices: number[], indicator: number[]) {
  const divergences: Array<{
    index: number
    type: 'bullish' | 'bearish'
    description: string
  }> = []
  
  for (let i = 20; i < prices.length - 1; i++) {
    // Divergência de alta: preço faz fundo mais baixo, indicador faz fundo mais alto
    if (prices[i] < prices[i - 10] && indicator[i] > indicator[i - 10]) {
      divergences.push({
        index: i,
        type: 'bullish',
        description: 'Divergência de alta detectada - preço pode subir'
      })
    }
    
    // Divergência de baixa: preço faz topo mais alto, indicador faz topo mais baixo
    if (prices[i] > prices[i - 10] && indicator[i] < indicator[i - 10]) {
      divergences.push({
        index: i,
        type: 'bearish',
        description: 'Divergência de baixa detectada - preço pode cair'
      })
    }
  }
  
  return divergences
}
