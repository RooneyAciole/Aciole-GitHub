"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, AlertTriangle, BookOpen, Zap, Lock, Crown, BarChart3, LineChart, Activity, Target, Brain, Shield, Building2, Sparkles, Search, X, MessageCircle, Send, Clock, ChevronRight } from 'lucide-react'

// Dados COMPLETOS dos ativos com TODOS os ativos mencionados
const ALL_ASSETS = [
  // Criptomoedas
  { symbol: 'Bitcoin', price: 99506.490, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'Litecoin', price: 96.670, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'Cardano', price: 0.530, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'BNB', price: 926.430, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'Ethereum', price: 3224.820, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'Solana', price: 144.400, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'BTC/USD', price: 99408.500, payout: 84, category: 'CRYPTO', type: 'Spot' },
  { symbol: 'BTC/USDT', price: 99408.500, payout: 76, category: 'CRYPTO', type: 'Futures' },
  { symbol: 'ETH/USDT', price: 3224.820, payout: 76, category: 'CRYPTO', type: 'Futures' },
  { symbol: 'XRP/USDT', price: 0.530, payout: 76, category: 'CRYPTO', type: 'Futures' },
  { symbol: 'SOL/USDT', price: 144.400, payout: 76, category: 'CRYPTO', type: 'Futures' },
  
  // Forex
  { symbol: 'AUD/JPY', price: 100.972, payout: 86, category: 'FOREX', type: 'Major' },
  { symbol: 'GBP/USD', price: 1.316, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'AUD/CAD', price: 0.917, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'USD/CAD', price: 1.404, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'NZD/USD', price: 0.566, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'USD/JPY', price: 154.627, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'CAD/JPY', price: 110.138, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'CHF/JPY', price: 194.904, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'EUR/NZD', price: 2.057, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'AUD/CHF', price: 0.518, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'EUR/AUD', price: 1.781, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'GBP/CHF', price: 1.044, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'GBP/AUD', price: 2.015, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'GBP/JPY', price: 203.476, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'USD/CHF', price: 0.793, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'NZD/JPY', price: 87.425, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'EUR/CHF', price: 0.923, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'CAD/CHF', price: 0.565, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'EUR/CAD', price: 1.633, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'AUD/NZD', price: 1.155, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'AUD/USD', price: 0.653, payout: 84, category: 'FOREX', type: 'Major' },
  { symbol: 'NZD/CHF', price: 0.449, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'GBP/CAD', price: 1.847, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'GBP/NZD', price: 2.327, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'NZD/CAD', price: 0.794, payout: 84, category: 'FOREX', type: 'Cross' },
  { symbol: 'EUR/USD', price: 1.085, payout: 76, category: 'FOREX', type: 'Major' },
  { symbol: 'EUR/GBP', price: 0.825, payout: 76, category: 'FOREX', type: 'Cross' },
  
  // OTC
  { symbol: 'GBP/USD (OTC)', price: 1.316, payout: 80, category: 'OTC', type: 'Forex' },
  { symbol: 'EUR/USD (OTC)', price: 1.085, payout: 80, category: 'OTC', type: 'Forex' },
  { symbol: 'JPY/USD (OTC)', price: 0.00647, payout: 80, category: 'OTC', type: 'Forex' },
  { symbol: 'AMEX (OTC)', price: 245.50, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'Microsoft (OTC)', price: 415.30, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'McDonald\'s (OTC)', price: 295.80, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'Apple (OTC)', price: 185.90, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'EUR/GBP (OTC)', price: 0.825, payout: 80, category: 'OTC', type: 'Forex' },
  { symbol: 'Facebook (OTC)', price: 485.20, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'UKOIL (OTC)', price: 78.45, payout: 80, category: 'OTC', type: 'Commodity' },
  { symbol: 'Bitcoin (OTC)', price: 99506.490, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'Ethereum (OTC)', price: 3224.820, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'XRP (OTC)', price: 0.530, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'Solana (OTC)', price: 144.400, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'Dogecoin (OTC)', price: 0.085, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'Cardano (OTC)', price: 0.530, payout: 80, category: 'OTC', type: 'Crypto' },
  { symbol: 'Google (OTC)', price: 142.50, payout: 80, category: 'OTC', type: 'Stock' },
  { symbol: 'Intel (OTC)', price: 42.30, payout: 80, category: 'OTC', type: 'Stock' },
]

export default function Home() {
  const [isPremium, setIsPremium] = useState(false)
  const [hasBasicPlan, setHasBasicPlan] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CRYPTO' | 'FOREX' | 'OTC'>('ALL')
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', message: string}>>([])]
  const [chatInput, setChatInput] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<typeof ALL_ASSETS[0] | null>(null)
  const [tradeTimer, setTradeTimer] = useState(60)
  const [trendUpdate, setTrendUpdate] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Evitar hydration mismatch - só renderizar após montagem
  useEffect(() => {
    setMounted(true)
  }, [])

  // Relógio sincronizado
  useEffect(() => {
    if (!mounted) return
    
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    
    updateTime() // Atualiza imediatamente
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  // Timer de 1 minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setTradeTimer(prev => prev <= 1 ? 60 : prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Atualizar tendências a cada segundo
  useEffect(() => {
    const trendTimer = setInterval(() => {
      setTrendUpdate(prev => prev + 1)
    }, 1000)
    return () => clearInterval(trendTimer)
  }, [])

  // Filtrar ativos pela busca - busca por primeira letra ou nome similar
  const filteredAssets = ALL_ASSETS.filter(asset => {
    const search = searchTerm.toLowerCase()
    const assetLower = asset.symbol.toLowerCase()
    
    // Filtro por categoria
    if (selectedCategory !== 'ALL' && asset.category !== selectedCategory) {
      return false
    }
    
    // Se não há busca, mostra todos
    if (!search) return true
    
    // Busca por primeira letra ou nome parcial
    return assetLower.includes(search) || assetLower.startsWith(search)
  })

  // Ordenar ativos por assertividade (simulado com base em análise)
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const getAccuracy = (asset: typeof ALL_ASSETS[0]) => {
      const hash = asset.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return 75 + (hash % 20)
    }
    return getAccuracy(b) - getAccuracy(a)
  })

  // Aviso após 15 minutos
  useEffect(() => {
    const warningTimer = setTimeout(() => {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 10000)
    }, 15 * 60 * 1000)
    return () => clearTimeout(warningTimer)
  }, [])

  // Sinais automáticos
  useEffect(() => {
    if (isPremium && autoTradeEnabled) {
      const interval = setInterval(() => {
        console.log('🤖 IA analisando mercado automaticamente...')
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPremium, autoTradeEnabled])

  // Chat
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    const userMessage = chatInput
    setChatMessages(prev => [...prev, { role: 'user', message: userMessage }])
    setChatInput('')

    setTimeout(() => {
      let aiResponse = ''
      if (userMessage.toLowerCase().includes('premium') || userMessage.toLowerCase().includes('plano')) {
        aiResponse = `🌟 O Plano Premium oferece:\n\n✅ Taxa de acerto de 90-92% (vs 85-87% do básico)\n✅ Operações quase automáticas com IA\n✅ Análises detalhadas em tempo real\n✅ Acesso a TODAS as estratégias avançadas\n✅ Suporte prioritário 24/7\n✅ Gestão de risco profissional\n\n💰 Com o Premium, você pode lucrar até 3x mais por mês! Muitos usuários pagam o plano apenas com os lucros da primeira semana.\n\n🚀 Upgrade agora por apenas R$ 97/mês e maximize seus ganhos!`
      } else {
        aiResponse = `Olá! 👋 Sou a IA do TradeAI Pro.\n\nPosso te ajudar com:\n• Explicações sobre os planos (Básico R$ 20 e Premium R$ 97)\n• Como lucrar com day trade\n• Estratégias de operação\n• Gestão de risco\n\nO que você gostaria de saber?`
      }
      setChatMessages(prev => [...prev, { role: 'ai', message: aiResponse }])
    }, 1000)
  }

  const formatTradeTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TradeAI Pro</h1>
                <p className="text-xs text-slate-400">Análise Inteligente em Tempo Real</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Relógio Sincronizado */}
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <Clock className="w-5 h-5 text-emerald-400" />
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-white">
                    {mounted ? currentTime : '00:00:00'}
                  </div>
                  <div className="text-xs text-slate-400">Horário da Corretora</div>
                </div>
              </div>
              {!hasBasicPlan && !isPremium && (
                <Button 
                  onClick={() => setHasBasicPlan(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
                >
                  Assinar Básico - R$ 20/mês
                </Button>
              )}
              {hasBasicPlan && !isPremium && (
                <>
                  <Badge className="bg-cyan-500 text-white border-0">Plano Básico Ativo</Badge>
                  <Button 
                    onClick={() => setIsPremium(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Premium - R$ 97/mês
                  </Button>
                </>
              )}
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium Ativo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-y border-amber-500/30 animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  <strong>💰 Oportunidade Especial:</strong> Você está há 15 minutos no site! Assine o Plano Básico por apenas R$ 20/mês e comece a lucrar hoje mesmo com sinais de alta precisão!
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowWarning(false)} className="text-amber-200 hover:text-amber-100">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-y border-orange-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-orange-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Aviso Importante:</strong> Nossa IA possui alta taxa de acertividade (até 92% no Premium), porém day trade envolve riscos. Opere com inteligência e gestão de risco adequada.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Timer de Day Trade */}
        <Card className="mb-6 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-emerald-500/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-emerald-400 animate-pulse" />
                <div>
                  <h3 className="font-bold text-white text-lg">Próxima Operação Day Trade</h3>
                  <p className="text-sm text-slate-300">Operações de 1 em 1 minuto • Tendências atualizadas a cada segundo</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-mono font-bold text-emerald-400">{formatTradeTimer(tradeTimer)}</div>
                <div className="text-xs text-slate-400 mt-1">Tempo restante</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Busca Rápida de Ativos */}
        <Card className="mb-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-purple-400" />
              Busca Rápida de Ativos
            </CardTitle>
            <CardDescription className="text-slate-300">
              Digite uma letra para ver todos os ativos (ex: B para Bitcoin, BNB, etc)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Digite uma letra ou nome do ativo (ex: B, BTC, EUR)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filtros por Categoria */}
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setSelectedCategory('ALL')}
                variant={selectedCategory === 'ALL' ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === 'ALL' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Todos ({ALL_ASSETS.length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('CRYPTO')}
                variant={selectedCategory === 'CRYPTO' ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === 'CRYPTO' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                ₿ Crypto ({ALL_ASSETS.filter(a => a.category === 'CRYPTO').length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('FOREX')}
                variant={selectedCategory === 'FOREX' ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === 'FOREX' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                💱 Forex ({ALL_ASSETS.filter(a => a.category === 'FOREX').length})
              </Button>
              <Button
                onClick={() => setSelectedCategory('OTC')}
                variant={selectedCategory === 'OTC' ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === 'OTC' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                📊 OTC ({ALL_ASSETS.filter(a => a.category === 'OTC').length})
              </Button>
            </div>

            {/* Lista de Ativos */}
            <div>
              <p className="text-sm text-slate-400 mb-3">
                {sortedAssets.length} resultado(s) encontrado(s) • Ordenados por assertividade
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto">
                {sortedAssets.map((asset) => {
                  const accuracy = 75 + (asset.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20)
                  const isPositive = Math.random() > 0.5
                  return (
                    <div
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset)}
                      className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105"
                    >
                      <div className="text-sm font-bold text-white mb-1 truncate">{asset.symbol}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-xs">
                          {isPositive ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">+{(Math.random() * 5).toFixed(2)}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-red-400" />
                              <span className="text-red-400">-{(Math.random() * 5).toFixed(2)}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs border-slate-600">
                          {asset.category}
                        </Badge>
                        <Badge className="bg-emerald-600 text-xs">{accuracy}%</Badge>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        Payout: {asset.payout}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico do Ativo Selecionado */}
        {selectedAsset && (
          <Card className="mb-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-cyan-500/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-cyan-400" />
                  Análise Completa - {selectedAsset.symbol}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription>
                Gráfico em tempo real com ferramentas de monitoramento e análise técnica • Payout: {selectedAsset.payout}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Gráfico Simulado */}
              <div className="bg-slate-950/50 rounded-lg p-8 border border-slate-700 mb-4">
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <Activity className="w-20 h-20 text-cyan-400 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-300 text-lg mb-2">Gráfico em Tempo Real - {selectedAsset.symbol}</p>
                    <p className="text-sm text-slate-400 mb-2">
                      Preço Atual: {selectedAsset.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                    </p>
                    <p className="text-sm text-slate-400">
                      Atualizando tendências a cada segundo • Próxima operação em {formatTradeTimer(tradeTimer)}
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">RSI (14)</div>
                        <div className="text-2xl font-bold text-emerald-400">{55 + (trendUpdate % 20)}</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">MACD</div>
                        <div className="text-2xl font-bold text-cyan-400">+{(0.5 + (trendUpdate % 10) / 10).toFixed(2)}</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-xs text-slate-400 mb-1">Volume</div>
                        <div className="text-2xl font-bold text-purple-400">{100 + (trendUpdate % 50)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análise e Recomendação */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Indicadores Técnicos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Média Móvel (20):</span>
                      <span className="text-emerald-400 font-bold">Bullish</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bandas de Bollinger:</span>
                      <span className="text-cyan-400 font-bold">Expansão</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estocástico:</span>
                      <span className="text-yellow-400 font-bold">Neutro</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ADX:</span>
                      <span className="text-emerald-400 font-bold">Tendência Forte</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border-emerald-500/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-400" />
                      Recomendação IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Operação:</span>
                      <Badge className="bg-emerald-600 text-lg px-4 py-1">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        COMPRA
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Assertividade:</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        {isPremium ? '91%' : hasBasicPlan ? '87%' : '83%'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-sm text-slate-300 mb-2">
                        <strong className="text-white">Análise:</strong> Padrão de rompimento confirmado com volume crescente. Suporte identificado.
                      </p>
                      <p className="text-xs text-slate-400">
                        {isPremium ? '✅ Recomendação: Entrar agora com gestão de risco adequada' : '🔒 Análise completa disponível no Premium'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estratégia P2 */}
              {isPremium && (
                <Card className="mt-4 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Brain className="w-5 h-5 text-amber-400" />
                      Estratégia P2 (Dobrar Capital)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300 text-sm space-y-2">
                    <p>
                      <strong className="text-white">Quando usar P2:</strong> Se a operação não seguir o padrão esperado e atingir o stop loss, considere dobrar o capital na próxima entrada.
                    </p>
                    <p>
                      <strong className="text-white">Condições para P2:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Padrão técnico ainda válido (suporte/resistência mantidos)</li>
                      <li>Volume continua acima da média</li>
                      <li>Indicadores confirmam reversão (RSI, MACD)</li>
                      <li>Risco/retorno favorável (mínimo 1:2)</li>
                    </ul>
                    <div className="pt-2 border-t border-amber-500/30">
                      <p className="text-amber-300">
                        ⚠️ <strong>Atenção:</strong> P2 é uma estratégia avançada. Use apenas se tiver capital suficiente e gestão de risco adequada.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resto do conteúdo (Tabs, etc) */}
        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="monitor" className="data-[state=active]:bg-slate-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-slate-800">
              <Zap className="w-4 h-4 mr-2" />
              Sinais IA
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-slate-800">
              <BookOpen className="w-4 h-4 mr-2" />
              Educação
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Taxa de Acerto IA</div>
                    <div className="text-3xl font-bold text-emerald-400">
                      {isPremium ? '92.1%' : hasBasicPlan ? '87.3%' : '85.0%'}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Ativos Monitorados</div>
                    <div className="text-3xl font-bold text-cyan-400">{ALL_ASSETS.length}</div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-1">Sinais Ativos</div>
                    <div className="text-3xl font-bold text-purple-400">
                      {isPremium ? '24' : hasBasicPlan ? '15' : '8'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Como Operar - Passo a Passo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">1</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Escolha o Ativo</h4>
                    <p className="text-sm text-slate-400">Use a busca rápida para encontrar o ativo desejado</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">2</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Verifique o Mercado</h4>
                    <p className="text-sm text-slate-400">Analise os indicadores técnicos e tendências</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Siga a Recomendação IA</h4>
                    <p className="text-sm text-slate-400">Execute a operação baseada na análise da IA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
              <CardContent className="py-8 text-center">
                <BookOpen className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Comece a Lucrar Hoje!</h3>
                <p className="text-slate-300 mb-4">Por apenas R$ 20/mês, tenha acesso a sinais precisos e estratégias validadas!</p>
                {!hasBasicPlan && !isPremium && (
                  <Button 
                    onClick={() => setHasBasicPlan(true)}
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    Assinar Plano Básico - R$ 20/mês
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <Button
            onClick={() => setChatOpen(true)}
            size="lg"
            className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl"
          >
            <MessageCircle className="w-8 h-8" />
          </Button>
        ) : (
          <Card className="w-96 h-[500px] bg-slate-900 border-slate-700 shadow-2xl flex flex-col">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Suporte IA</CardTitle>
                  <CardDescription className="text-purple-100 text-xs">Tire suas dúvidas</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)} className="text-white hover:bg-purple-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                  <p>Olá! 👋 Sou a IA do TradeAI Pro.</p>
                  <p className="mt-2">Pergunte sobre nossos planos!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {msg.message.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button onClick={handleSendMessage} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>TradeAI Pro - Análise Inteligente para Day Trade</p>
          <p className="mt-2 text-xs">Investimentos envolvem riscos. Opere com responsabilidade.</p>
        </div>
      </footer>
    </div>
  )
}
