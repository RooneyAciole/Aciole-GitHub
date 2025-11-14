'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Download,
  Info,
  AlertCircle
} from 'lucide-react'
import { 
  calculateRSI, 
  calculateMACD, 
  calculateBollingerBands, 
  calculateATR,
  calculateStochastic,
  calculateEMA,
  calculateSMA,
  detectCandlePatterns,
  detectDivergence,
  CandleData
} from '@/lib/indicators'
import { 
  generateCandleData, 
  formatPrice, 
  formatTime,
  findSupportResistance,
  generateMarkerExplanation,
  calculateRiskReward,
  TIMEFRAMES,
  CHART_COLORS
} from '@/lib/chart-utils'

interface CandlestickChartProps {
  symbol: string
  basePrice: number
  onGeneratePDF?: () => void
}

export default function CandlestickChart({ symbol, basePrice, onGeneratePDF }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState('5m')
  const [indicators, setIndicators] = useState({
    rsi: true,
    macd: true,
    bollinger: true,
    ema: true,
    volume: true
  })
  
  const [analysis, setAnalysis] = useState<{
    rsi: number
    macd: { value: number, signal: number, histogram: number }
    atr: number
    trend: 'bullish' | 'bearish' | 'neutral'
    patterns: Array<{ pattern: string, signal: string, description: string }>
    recommendation: string
  } | null>(null)

  // Inicializar gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: CHART_COLORS.background },
        textColor: CHART_COLORS.text,
      },
      grid: {
        vertLines: { color: CHART_COLORS.grid },
        horzLines: { color: CHART_COLORS.grid },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.grid,
      },
      timeScale: {
        borderColor: CHART_COLORS.grid,
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: CHART_COLORS.upColor,
      downColor: CHART_COLORS.downColor,
      borderUpColor: CHART_COLORS.borderUpColor,
      borderDownColor: CHART_COLORS.borderDownColor,
      wickUpColor: CHART_COLORS.wickUpColor,
      wickDownColor: CHART_COLORS.wickDownColor,
    })

    chartRef.current = chart
    candleSeriesRef.current = candleSeries

    // Gerar dados iniciais
    const data = generateCandleData(basePrice, 100)
    setCandleData(data)
    
    const formattedData: CandlestickData<Time>[] = data.map(d => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))
    
    candleSeries.setData(formattedData)

    // Responsividade
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [basePrice])

  // Atualizar análise quando dados mudarem
  useEffect(() => {
    if (candleData.length < 30) return

    const rsiValues = calculateRSI(candleData, 14)
    const currentRSI = rsiValues[rsiValues.length - 1] || 50

    const macdData = calculateMACD(candleData)
    const currentMACD = {
      value: macdData.macdLine[macdData.macdLine.length - 1] || 0,
      signal: macdData.signalLine[macdData.signalLine.length - 1] || 0,
      histogram: macdData.histogram[macdData.histogram.length - 1] || 0
    }

    const atrValues = calculateATR(candleData, 14)
    const currentATR = atrValues[atrValues.length - 1] || 0

    const patterns = detectCandlePatterns(candleData)
    const recentPatterns = patterns.slice(-3)

    // Determinar tendência
    const ema20 = calculateEMA(candleData.map(d => d.close), 20)
    const ema50 = calculateEMA(candleData.map(d => d.close), 50)
    const currentPrice = candleData[candleData.length - 1].close
    const currentEMA20 = ema20[ema20.length - 1]
    const currentEMA50 = ema50[ema50.length - 1]

    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    if (currentPrice > currentEMA20 && currentEMA20 > currentEMA50) {
      trend = 'bullish'
    } else if (currentPrice < currentEMA20 && currentEMA20 < currentEMA50) {
      trend = 'bearish'
    }

    // Gerar recomendação
    let recommendation = ''
    if (currentRSI > 70 && currentMACD.histogram < 0) {
      recommendation = '⚠️ Sobrecomprado com MACD negativo - possível correção'
    } else if (currentRSI < 30 && currentMACD.histogram > 0) {
      recommendation = '✅ Sobrevendido com MACD positivo - oportunidade de compra'
    } else if (trend === 'bullish' && currentRSI > 50 && currentRSI < 70) {
      recommendation = '📈 Tendência de alta confirmada - considere entrada comprada'
    } else if (trend === 'bearish' && currentRSI < 50 && currentRSI > 30) {
      recommendation = '📉 Tendência de baixa confirmada - considere entrada vendida'
    } else {
      recommendation = '⏸️ Mercado lateral - aguarde confirmação de tendência'
    }

    setAnalysis({
      rsi: currentRSI,
      macd: currentMACD,
      atr: currentATR,
      trend,
      patterns: recentPatterns,
      recommendation
    })
  }, [candleData])

  // Adicionar indicadores ao gráfico
  useEffect(() => {
    if (!chartRef.current || !candleSeriesRef.current || candleData.length < 30) return

    // Limpar indicadores anteriores (simplificado)
    // Em produção, você manteria referências para cada série

    // RSI
    if (indicators.rsi) {
      const rsiValues = calculateRSI(candleData, 14)
      // Adicionar linha RSI (requer painel separado em produção)
    }

    // Bollinger Bands
    if (indicators.bollinger) {
      const bollinger = calculateBollingerBands(candleData, 20, 2)
      // Adicionar bandas ao gráfico
    }

    // EMA
    if (indicators.ema) {
      const ema20 = calculateEMA(candleData.map(d => d.close), 20)
      const ema50 = calculateEMA(candleData.map(d => d.close), 50)
      // Adicionar linhas EMA
    }
  }, [candleData, indicators])

  // Atualizar dados em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (candleData.length === 0) return

      const lastCandle = candleData[candleData.length - 1]
      const volatility = basePrice * 0.002
      const change = (Math.random() - 0.5) * volatility * 2
      
      const newClose = lastCandle.close + change
      const newHigh = Math.max(lastCandle.high, newClose + Math.random() * volatility * 0.5)
      const newLow = Math.min(lastCandle.low, newClose - Math.random() * volatility * 0.5)

      const updatedCandle: CandleData = {
        ...lastCandle,
        high: newHigh,
        low: newLow,
        close: newClose
      }

      const newData = [...candleData.slice(0, -1), updatedCandle]
      setCandleData(newData)

      if (candleSeriesRef.current) {
        candleSeriesRef.current.update({
          time: updatedCandle.time as Time,
          open: updatedCandle.open,
          high: updatedCandle.high,
          low: updatedCandle.low,
          close: updatedCandle.close,
        })
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [candleData, basePrice])

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Gráfico de Velas - {symbol}
            </CardTitle>
            <CardDescription>
              Análise técnica profissional com indicadores em tempo real
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGeneratePDF}
              className="border-slate-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Gerar PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeframes */}
        <div className="flex gap-2 flex-wrap">
          {TIMEFRAMES.map(tf => (
            <Button
              key={tf.value}
              variant={selectedTimeframe === tf.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(tf.value)}
              className={selectedTimeframe === tf.value ? 'bg-cyan-600' : 'border-slate-600'}
            >
              {tf.label}
            </Button>
          ))}
        </div>

        {/* Gráfico */}
        <div 
          ref={chartContainerRef} 
          className="w-full rounded-lg border border-slate-700 overflow-hidden"
        />

        {/* Análise em Tempo Real */}
        {analysis && (
          <div className="grid md:grid-cols-3 gap-4">
            {/* Indicadores Principais */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Indicadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">RSI (14):</span>
                  <Badge className={
                    analysis.rsi > 70 ? 'bg-red-600' :
                    analysis.rsi < 30 ? 'bg-green-600' :
                    'bg-yellow-600'
                  }>
                    {analysis.rsi.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">MACD:</span>
                  <Badge className={analysis.macd.histogram > 0 ? 'bg-green-600' : 'bg-red-600'}>
                    {analysis.macd.histogram.toFixed(4)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">ATR (14):</span>
                  <Badge className="bg-blue-600">
                    {analysis.atr.toFixed(4)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Tendência:</span>
                  <Badge className={
                    analysis.trend === 'bullish' ? 'bg-green-600' :
                    analysis.trend === 'bearish' ? 'bg-red-600' :
                    'bg-gray-600'
                  }>
                    {analysis.trend === 'bullish' ? '📈 Alta' :
                     analysis.trend === 'bearish' ? '📉 Baixa' :
                     '⏸️ Lateral'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Padrões Detectados */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Padrões
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.patterns.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.patterns.map((pattern, idx) => (
                      <div key={idx} className="text-xs">
                        <Badge className={
                          pattern.signal === 'bullish' ? 'bg-green-600' : 'bg-red-600'
                        }>
                          {pattern.pattern}
                        </Badge>
                        <p className="text-slate-400 mt-1">{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">Nenhum padrão detectado</p>
                )}
              </CardContent>
            </Card>

            {/* Recomendação */}
            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/50">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Recomendação IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {analysis.recommendation}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-400">
                    💡 Baseado em: RSI, MACD, ATR, Padrões de Candlestick e Tendência
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controles de Indicadores */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Indicadores Visíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(indicators).map(([key, value]) => (
                <Button
                  key={key}
                  variant={value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndicators(prev => ({ ...prev, [key]: !value }))}
                  className={value ? 'bg-purple-600' : 'border-slate-600'}
                >
                  {key.toUpperCase()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explicação Educacional */}
        <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              Como Interpretar Este Gráfico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-300">
            <p>🕯️ <strong>Velas:</strong> Verde = preço subiu | Vermelha = preço caiu</p>
            <p>📊 <strong>RSI &gt; 70:</strong> Sobrecomprado (pode cair) | <strong>RSI &lt; 30:</strong> Sobrevendido (pode subir)</p>
            <p>📈 <strong>MACD positivo:</strong> Momentum de alta | <strong>MACD negativo:</strong> Momentum de baixa</p>
            <p>⚡ <strong>ATR:</strong> Mede volatilidade - quanto maior, mais movimento</p>
            <p>🎯 <strong>Padrões:</strong> Formações específicas que indicam possíveis reversões</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
