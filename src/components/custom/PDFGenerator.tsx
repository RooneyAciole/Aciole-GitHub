'use client'

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { CandleData } from '@/lib/indicators'
import { formatPrice, formatTime } from '@/lib/chart-utils'

interface PDFGeneratorProps {
  symbol: string
  candleData: CandleData[]
  analysis: {
    rsi: number
    macd: { value: number, signal: number, histogram: number }
    atr: number
    trend: 'bullish' | 'bearish' | 'neutral'
    patterns: Array<{ pattern: string, signal: string, description: string }>
    recommendation: string
  }
  chartElement?: HTMLElement
}

export async function generateTradingPDF({
  symbol,
  candleData,
  analysis,
  chartElement
}: PDFGeneratorProps) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPosition = 20

  // Título
  pdf.setFontSize(24)
  pdf.setTextColor(16, 185, 129) // Emerald
  pdf.text(`Relatório de Análise - ${symbol}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 10
  pdf.setFontSize(10)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' })
  
  yPosition += 15

  // Seção 1: Resumo Executivo
  pdf.setFontSize(16)
  pdf.setTextColor(59, 130, 246) // Blue
  pdf.text('📊 Resumo Executivo', 15, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  
  const currentPrice = candleData[candleData.length - 1]?.close || 0
  const openPrice = candleData[0]?.open || 0
  const change = ((currentPrice - openPrice) / openPrice) * 100

  pdf.text(`Preço Atual: ${formatPrice(currentPrice)}`, 15, yPosition)
  yPosition += 6
  pdf.text(`Variação: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`, 15, yPosition)
  yPosition += 6
  pdf.text(`Tendência: ${analysis.trend === 'bullish' ? '📈 Alta' : analysis.trend === 'bearish' ? '📉 Baixa' : '⏸️ Lateral'}`, 15, yPosition)
  yPosition += 10

  // Seção 2: Indicadores Técnicos
  pdf.setFontSize(16)
  pdf.setTextColor(139, 92, 246) // Purple
  pdf.text('📈 Indicadores Técnicos', 15, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)

  // RSI
  pdf.text(`RSI (14): ${analysis.rsi.toFixed(2)}`, 15, yPosition)
  yPosition += 5
  const rsiStatus = analysis.rsi > 70 ? 'Sobrecomprado ⚠️' : analysis.rsi < 30 ? 'Sobrevendido ✅' : 'Neutro ⏸️'
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`   Status: ${rsiStatus}`, 15, yPosition)
  yPosition += 6

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  
  // MACD
  pdf.text(`MACD: ${analysis.macd.value.toFixed(4)}`, 15, yPosition)
  yPosition += 5
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`   Sinal: ${analysis.macd.signal.toFixed(4)}`, 15, yPosition)
  yPosition += 5
  pdf.text(`   Histograma: ${analysis.macd.histogram.toFixed(4)} ${analysis.macd.histogram > 0 ? '(Positivo ✅)' : '(Negativo ⚠️)'}`, 15, yPosition)
  yPosition += 6

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  
  // ATR
  pdf.text(`ATR (14): ${analysis.atr.toFixed(4)}`, 15, yPosition)
  yPosition += 5
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 100)
  pdf.text(`   Volatilidade: ${analysis.atr > currentPrice * 0.01 ? 'Alta ⚡' : 'Moderada 📊'}`, 15, yPosition)
  yPosition += 10

  // Seção 3: Padrões de Candlestick
  if (analysis.patterns.length > 0) {
    pdf.setFontSize(16)
    pdf.setTextColor(245, 158, 11) // Amber
    pdf.text('🕯️ Padrões Detectados', 15, yPosition)
    yPosition += 8

    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)

    analysis.patterns.forEach((pattern, idx) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 20
      }

      pdf.text(`${idx + 1}. ${pattern.pattern}`, 15, yPosition)
      yPosition += 5
      pdf.setFontSize(9)
      pdf.setTextColor(100, 100, 100)
      const lines = pdf.splitTextToSize(`   ${pattern.description}`, pageWidth - 30)
      pdf.text(lines, 15, yPosition)
      yPosition += lines.length * 5 + 3
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
    })

    yPosition += 5
  }

  // Seção 4: Recomendação da IA
  if (yPosition > pageHeight - 40) {
    pdf.addPage()
    yPosition = 20
  }

  pdf.setFontSize(16)
  pdf.setTextColor(16, 185, 129) // Emerald
  pdf.text('🤖 Recomendação da IA', 15, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  const recommendationLines = pdf.splitTextToSize(analysis.recommendation, pageWidth - 30)
  pdf.text(recommendationLines, 15, yPosition)
  yPosition += recommendationLines.length * 5 + 10

  // Seção 5: Gestão de Risco
  if (yPosition > pageHeight - 50) {
    pdf.addPage()
    yPosition = 20
  }

  pdf.setFontSize(16)
  pdf.setTextColor(239, 68, 68) // Red
  pdf.text('🛡️ Gestão de Risco', 15, yPosition)
  yPosition += 8

  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)

  const stopLoss = currentPrice - (analysis.atr * 2)
  const takeProfit = currentPrice + (analysis.atr * 3)
  const riskReward = (takeProfit - currentPrice) / (currentPrice - stopLoss)

  pdf.text(`Entrada Sugerida: ${formatPrice(currentPrice)}`, 15, yPosition)
  yPosition += 6
  pdf.text(`Stop Loss: ${formatPrice(stopLoss)} (${((stopLoss - currentPrice) / currentPrice * 100).toFixed(2)}%)`, 15, yPosition)
  yPosition += 6
  pdf.text(`Take Profit: ${formatPrice(takeProfit)} (${((takeProfit - currentPrice) / currentPrice * 100).toFixed(2)}%)`, 15, yPosition)
  yPosition += 6
  pdf.text(`Relação Risco/Retorno: 1:${riskReward.toFixed(2)}`, 15, yPosition)
  yPosition += 10

  // Seção 6: Explicação dos Indicadores (Educacional)
  pdf.addPage()
  yPosition = 20

  pdf.setFontSize(16)
  pdf.setTextColor(59, 130, 246)
  pdf.text('📚 Guia de Indicadores', 15, yPosition)
  yPosition += 10

  // RSI
  pdf.setFontSize(12)
  pdf.setTextColor(139, 92, 246)
  pdf.text('RSI (Índice de Força Relativa)', 15, yPosition)
  yPosition += 6
  pdf.setFontSize(9)
  pdf.setTextColor(0, 0, 0)
  const rsiText = [
    'O RSI mede o momentum do preço em uma escala de 0 a 100.',
    '• RSI > 70: Ativo sobrecomprado (pode haver correção)',
    '• RSI < 30: Ativo sobrevendido (pode haver recuperação)',
    '• RSI = 50: Neutro, sem direção clara',
    '',
    'Como usar: Combine com outros indicadores para confirmar sinais.'
  ]
  rsiText.forEach(line => {
    pdf.text(line, 15, yPosition)
    yPosition += 5
  })
  yPosition += 5

  // MACD
  pdf.setFontSize(12)
  pdf.setTextColor(139, 92, 246)
  pdf.text('MACD (Convergência/Divergência de Médias Móveis)', 15, yPosition)
  yPosition += 6
  pdf.setFontSize(9)
  pdf.setTextColor(0, 0, 0)
  const macdText = [
    'O MACD mostra a relação entre duas médias móveis exponenciais.',
    '• Linha MACD cruza acima da Linha de Sinal: Sinal de compra',
    '• Linha MACD cruza abaixo da Linha de Sinal: Sinal de venda',
    '• Histograma positivo: Momentum de alta',
    '• Histograma negativo: Momentum de baixa',
    '',
    'Como usar: Procure cruzamentos e divergências com o preço.'
  ]
  macdText.forEach(line => {
    pdf.text(line, 15, yPosition)
    yPosition += 5
  })
  yPosition += 5

  // ATR
  pdf.setFontSize(12)
  pdf.setTextColor(139, 92, 246)
  pdf.text('ATR (Average True Range)', 15, yPosition)
  yPosition += 6
  pdf.setFontSize(9)
  pdf.setTextColor(0, 0, 0)
  const atrText = [
    'O ATR mede a volatilidade do mercado.',
    '• ATR alto: Mercado volátil, movimentos grandes',
    '• ATR baixo: Mercado calmo, movimentos pequenos',
    '',
    'Como usar: Use para definir stop loss (2x ATR) e take profit (3x ATR).'
  ]
  atrText.forEach(line => {
    pdf.text(line, 15, yPosition)
    yPosition += 5
  })
  yPosition += 10

  // Aviso de Risco
  pdf.setFontSize(12)
  pdf.setTextColor(239, 68, 68)
  pdf.text('⚠️ Aviso de Risco', 15, yPosition)
  yPosition += 6
  pdf.setFontSize(9)
  pdf.setTextColor(0, 0, 0)
  const warningText = [
    'Indicadores técnicos são ferramentas de análise, não garantias de lucro.',
    'Day trade envolve riscos significativos. Opere apenas com capital que pode perder.',
    'Sempre use gestão de risco adequada e nunca arrisque mais de 2% do capital por operação.',
    'Pratique em conta demo antes de operar com dinheiro real.',
    'Este relatório é apenas educacional e não constitui recomendação de investimento.'
  ]
  warningText.forEach(line => {
    const lines = pdf.splitTextToSize(line, pageWidth - 30)
    pdf.text(lines, 15, yPosition)
    yPosition += lines.length * 5
  })

  // Capturar gráfico se disponível
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#0f172a',
        scale: 2
      })
      const imgData = canvas.toDataURL('image/png')
      
      pdf.addPage()
      pdf.setFontSize(16)
      pdf.setTextColor(59, 130, 246)
      pdf.text('📊 Gráfico de Velas', 15, 20)
      
      const imgWidth = pageWidth - 30
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 15, 30, imgWidth, Math.min(imgHeight, pageHeight - 50))
    } catch (error) {
      console.error('Erro ao capturar gráfico:', error)
    }
  }

  // Salvar PDF
  pdf.save(`analise-${symbol}-${Date.now()}.pdf`)
}

interface PDFButtonProps {
  symbol: string
  candleData: CandleData[]
  analysis: {
    rsi: number
    macd: { value: number, signal: number, histogram: number }
    atr: number
    trend: 'bullish' | 'bearish' | 'neutral'
    patterns: Array<{ pattern: string, signal: string, description: string }>
    recommendation: string
  }
  chartElementId?: string
}

export function PDFGeneratorButton({ symbol, candleData, analysis, chartElementId }: PDFButtonProps) {
  const handleGeneratePDF = async () => {
    const chartElement = chartElementId ? document.getElementById(chartElementId) : undefined
    await generateTradingPDF({
      symbol,
      candleData,
      analysis,
      chartElement: chartElement || undefined
    })
  }

  return (
    <Button
      onClick={handleGeneratePDF}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
    >
      <FileText className="w-4 h-4 mr-2" />
      Gerar Relatório PDF
    </Button>
  )
}
