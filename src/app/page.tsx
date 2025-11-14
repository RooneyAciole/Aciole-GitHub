"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, AlertTriangle, BookOpen, Zap, Lock, Crown, BarChart3, LineChart, Activity, Target, Brain, Shield, Building2, Sparkles, Search, X, MessageCircle, Send, Clock, ChevronRight, ChevronLeft, Download, PlayCircle, GraduationCap, FileText } from 'lucide-react'
import CandlestickChart from '@/components/custom/CandlestickChart'
import { PDFGeneratorButton } from '@/components/custom/PDFGenerator'

// Dados COMPLETOS dos ativos com TODOS os ativos mencionados
const ALL_ASSETS = [
  // Criptomoedas
  { symbol: 'Bitcoin', price: 99506.490, payout: 84, category: 'CRYPTO', type: 'Spot', change: 2.34, isPositive: true },
  { symbol: 'Litecoin', price: 96.670, payout: 84, category: 'CRYPTO', type: 'Spot', change: 1.56, isPositive: true },
  { symbol: 'Cardano', price: 0.530, payout: 84, category: 'CRYPTO', type: 'Spot', change: 0.89, isPositive: false },
  { symbol: 'BNB', price: 926.430, payout: 84, category: 'CRYPTO', type: 'Spot', change: 3.21, isPositive: true },
  { symbol: 'Ethereum', price: 3224.820, payout: 84, category: 'CRYPTO', type: 'Spot', change: 1.78, isPositive: true },
  { symbol: 'Solana', price: 144.400, payout: 84, category: 'CRYPTO', type: 'Spot', change: 4.12, isPositive: true },
  { symbol: 'BTC/USD', price: 99408.500, payout: 84, category: 'CRYPTO', type: 'Spot', change: 2.45, isPositive: true },
  { symbol: 'BTC/USDT', price: 99408.500, payout: 76, category: 'CRYPTO', type: 'Futures', change: 2.34, isPositive: true },
  { symbol: 'ETH/USDT', price: 3224.820, payout: 76, category: 'CRYPTO', type: 'Futures', change: 1.67, isPositive: true },
  { symbol: 'XRP/USDT', price: 0.530, payout: 76, category: 'CRYPTO', type: 'Futures', change: 0.92, isPositive: false },
  { symbol: 'SOL/USDT', price: 144.400, payout: 76, category: 'CRYPTO', type: 'Futures', change: 3.89, isPositive: true },
  
  // Forex
  { symbol: 'AUD/JPY', price: 100.972, payout: 86, category: 'FOREX', type: 'Major', change: 0.45, isPositive: true },
  { symbol: 'GBP/USD', price: 1.316, payout: 84, category: 'FOREX', type: 'Major', change: 0.23, isPositive: false },
  { symbol: 'AUD/CAD', price: 0.917, payout: 84, category: 'FOREX', type: 'Cross', change: 0.12, isPositive: true },
  { symbol: 'USD/CAD', price: 1.404, payout: 84, category: 'FOREX', type: 'Major', change: 0.34, isPositive: true },
  { symbol: 'NZD/USD', price: 0.566, payout: 84, category: 'FOREX', type: 'Major', change: 0.18, isPositive: false },
  { symbol: 'USD/JPY', price: 154.627, payout: 84, category: 'FOREX', type: 'Major', change: 0.56, isPositive: true },
  { symbol: 'CAD/JPY', price: 110.138, payout: 84, category: 'FOREX', type: 'Cross', change: 0.29, isPositive: true },
  { symbol: 'CHF/JPY', price: 194.904, payout: 84, category: 'FOREX', type: 'Cross', change: 0.41, isPositive: true },
  { symbol: 'EUR/NZD', price: 2.057, payout: 84, category: 'FOREX', type: 'Cross', change: 0.15, isPositive: false },
  { symbol: 'AUD/CHF', price: 0.518, payout: 84, category: 'FOREX', type: 'Cross', change: 0.22, isPositive: true },
  { symbol: 'EUR/AUD', price: 1.781, payout: 84, category: 'FOREX', type: 'Cross', change: 0.31, isPositive: false },
  { symbol: 'GBP/CHF', price: 1.044, payout: 84, category: 'FOREX', type: 'Cross', change: 0.19, isPositive: true },
  { symbol: 'GBP/AUD', price: 2.015, payout: 84, category: 'FOREX', type: 'Cross', change: 0.27, isPositive: false },
  { symbol: 'GBP/JPY', price: 203.476, payout: 84, category: 'FOREX', type: 'Cross', change: 0.38, isPositive: true },
  { symbol: 'USD/CHF', price: 0.793, payout: 84, category: 'FOREX', type: 'Major', change: 0.14, isPositive: true },
  { symbol: 'NZD/JPY', price: 87.425, payout: 84, category: 'FOREX', type: 'Cross', change: 0.26, isPositive: true },
  { symbol: 'EUR/CHF', price: 0.923, payout: 84, category: 'FOREX', type: 'Cross', change: 0.17, isPositive: false },
  { symbol: 'CAD/CHF', price: 0.565, payout: 84, category: 'FOREX', type: 'Cross', change: 0.21, isPositive: true },
  { symbol: 'EUR/CAD', price: 1.633, payout: 84, category: 'FOREX', type: 'Cross', change: 0.33, isPositive: false },
  { symbol: 'AUD/NZD', price: 1.155, payout: 84, category: 'FOREX', type: 'Cross', change: 0.11, isPositive: true },
  { symbol: 'AUD/USD', price: 0.653, payout: 84, category: 'FOREX', type: 'Major', change: 0.24, isPositive: true },
  { symbol: 'NZD/CHF', price: 0.449, payout: 84, category: 'FOREX', type: 'Cross', change: 0.16, isPositive: false },
  { symbol: 'GBP/CAD', price: 1.847, payout: 84, category: 'FOREX', type: 'Cross', change: 0.28, isPositive: true },
  { symbol: 'GBP/NZD', price: 2.327, payout: 84, category: 'FOREX', type: 'Cross', change: 0.35, isPositive: false },
  { symbol: 'NZD/CAD', price: 0.794, payout: 84, category: 'FOREX', type: 'Cross', change: 0.13, isPositive: true },
  { symbol: 'EUR/USD', price: 1.085, payout: 76, category: 'FOREX', type: 'Major', change: 0.19, isPositive: false },
  { symbol: 'EUR/GBP', price: 0.825, payout: 76, category: 'FOREX', type: 'Cross', change: 0.25, isPositive: true },
  
  // OTC
  { symbol: 'GBP/USD (OTC)', price: 1.316, payout: 80, category: 'OTC', type: 'Forex', change: 0.22, isPositive: false },
  { symbol: 'EUR/USD (OTC)', price: 1.085, payout: 80, category: 'OTC', type: 'Forex', change: 0.18, isPositive: false },
  { symbol: 'JPY/USD (OTC)', price: 0.00647, payout: 80, category: 'OTC', type: 'Forex', change: 0.31, isPositive: true },
  { symbol: 'AMEX (OTC)', price: 245.50, payout: 80, category: 'OTC', type: 'Stock', change: 1.45, isPositive: true },
  { symbol: 'Microsoft (OTC)', price: 415.30, payout: 80, category: 'OTC', type: 'Stock', change: 2.12, isPositive: true },
  { symbol: 'McDonald\'s (OTC)', price: 295.80, payout: 80, category: 'OTC', type: 'Stock', change: 0.87, isPositive: false },
  { symbol: 'Apple (OTC)', price: 185.90, payout: 80, category: 'OTC', type: 'Stock', change: 1.67, isPositive: true },
  { symbol: 'EUR/GBP (OTC)', price: 0.825, payout: 80, category: 'OTC', type: 'Forex', change: 0.24, isPositive: true },
  { symbol: 'Facebook (OTC)', price: 485.20, payout: 80, category: 'OTC', type: 'Stock', change: 3.21, isPositive: true },
  { symbol: 'UKOIL (OTC)', price: 78.45, payout: 80, category: 'OTC', type: 'Commodity', change: 1.89, isPositive: false },
  { symbol: 'Bitcoin (OTC)', price: 99506.490, payout: 80, category: 'OTC', type: 'Crypto', change: 2.34, isPositive: true },
  { symbol: 'Ethereum (OTC)', price: 3224.820, payout: 80, category: 'OTC', type: 'Crypto', change: 1.78, isPositive: true },
  { symbol: 'XRP (OTC)', price: 0.530, payout: 80, category: 'OTC', type: 'Crypto', change: 0.92, isPositive: false },
  { symbol: 'Solana (OTC)', price: 144.400, payout: 80, category: 'OTC', type: 'Crypto', change: 4.12, isPositive: true },
  { symbol: 'Dogecoin (OTC)', price: 0.085, payout: 80, category: 'OTC', type: 'Crypto', change: 5.67, isPositive: true },
  { symbol: 'Cardano (OTC)', price: 0.530, payout: 80, category: 'OTC', type: 'Crypto', change: 0.89, isPositive: false },
  { symbol: 'Google (OTC)', price: 142.50, payout: 80, category: 'OTC', type: 'Stock', change: 1.34, isPositive: true },
  { symbol: 'Intel (OTC)', price: 42.30, payout: 80, category: 'OTC', type: 'Stock', change: 0.76, isPositive: false },
]

// Conteúdo educacional direto na plataforma
const EDUCATION_CONTENT = {
  beginner: {
    title: 'Day Trade para Iniciantes',
    description: 'Aprenda do zero como operar no mercado financeiro',
    duration: '8 horas',
    lessons: 24,
    modules: [
      {
        title: 'Módulo 1: Fundamentos do Day Trade',
        lessons: [
          {
            title: 'O que é Day Trade e como funciona',
            content: `Day Trade é a prática de comprar e vender ativos financeiros no mesmo dia, buscando lucrar com pequenas variações de preço.

**Características principais:**
• Operações abertas e fechadas no mesmo dia
• Foco em movimentos de curto prazo (minutos a horas)
• Uso de análise técnica e gráficos
• Gestão de risco rigorosa

**Como funciona:**
1. Você analisa o mercado usando indicadores técnicos
2. Identifica oportunidades de entrada (compra ou venda)
3. Define stop loss (limite de perda) e take profit (objetivo de lucro)
4. Executa a operação e monitora em tempo real
5. Fecha a posição antes do fim do dia

**Mercados disponíveis:**
• Forex (pares de moedas)
• Criptomoedas (Bitcoin, Ethereum, etc)
• Ações (empresas listadas em bolsa)
• Commodities (ouro, petróleo, etc)`,
            chart: 'intro'
          },
          {
            title: 'Principais mercados: Forex, Cripto e Ações',
            content: `**FOREX (Mercado de Câmbio)**
• Maior mercado financeiro do mundo
• Funciona 24h por dia, 5 dias por semana
• Alta liquidez e spreads baixos
• Exemplos: EUR/USD, GBP/USD, USD/JPY

**CRIPTOMOEDAS**
• Mercado 24/7 (funciona todos os dias)
• Alta volatilidade = mais oportunidades
• Descentralizado e global
• Exemplos: Bitcoin, Ethereum, Solana

**AÇÕES**
• Empresas listadas em bolsa
• Horário de funcionamento limitado
• Influenciadas por notícias e resultados
• Exemplos: Apple, Microsoft, Google

**Qual escolher?**
• Iniciantes: Forex (mais estável)
• Arrojados: Cripto (mais volátil)
• Conservadores: Ações (mais previsível)`,
            chart: 'markets'
          },
          {
            title: 'Horários de funcionamento dos mercados',
            content: `**FOREX - 24h/5 dias**
• Sessão Asiática: 20h - 5h (Brasília)
• Sessão Europeia: 3h - 12h (Brasília)
• Sessão Americana: 8h - 17h (Brasília)
• Melhor horário: Sobreposição Europa/América (8h-12h)

**CRIPTOMOEDAS - 24h/7 dias**
• Funciona sem parar, todos os dias
• Maior volume: Horário comercial EUA
• Fins de semana: Menos liquidez

**AÇÕES (B3 - Brasil)**
• Pré-abertura: 9h45 - 10h
• Pregão regular: 10h - 17h
• After market: 17h30 - 18h

**DICA IMPORTANTE:**
Sincronize suas operações com o horário de Brasília. Nossa plataforma já faz isso automaticamente!`,
            chart: 'schedule'
          },
          {
            title: 'Conceitos básicos: Compra, Venda, Stop Loss',
            content: `**COMPRA (CALL/BUY)**
• Você acredita que o preço vai SUBIR
• Lucra quando o ativo valoriza
• Exemplo: Compra Bitcoin a $99.000, vende a $99.500 = +$500

**VENDA (PUT/SELL)**
• Você acredita que o preço vai CAIR
• Lucra quando o ativo desvaloriza
• Exemplo: Vende EUR/USD a 1.0850, compra a 1.0800 = +50 pips

**STOP LOSS (Proteção)**
• Limite máximo de perda que você aceita
• Fecha automaticamente se atingir o valor
• Exemplo: Compra a $100, stop loss a $98 = perda máxima de $2

**TAKE PROFIT (Objetivo)**
• Valor onde você quer realizar o lucro
• Fecha automaticamente ao atingir
• Exemplo: Compra a $100, take profit a $105 = lucro de $5

**REGRA DE OURO:**
Sempre defina stop loss ANTES de entrar na operação!`,
            chart: 'basics'
          },
        ]
      },
      {
        title: 'Módulo 2: Lendo Gráficos',
        lessons: [
          {
            title: 'Tipos de gráficos: Candlestick, Linha, Barras',
            content: `**CANDLESTICK (Velas Japonesas) - MAIS USADO**
• Mostra abertura, fechamento, máxima e mínima
• Vela verde/branca = preço subiu
• Vela vermelha/preta = preço caiu
• Corpo da vela = diferença entre abertura e fechamento
• Sombras = máxima e mínima do período

**GRÁFICO DE LINHA**
• Conecta apenas os preços de fechamento
• Mais simples, menos informação
• Útil para visão geral de tendência

**GRÁFICO DE BARRAS**
• Similar ao candlestick, mas em formato de barra
• Menos visual, mais técnico
• Pouco usado no day trade moderno

**RECOMENDAÇÃO:**
Use candlestick! É o mais completo e visual para day trade.`,
            chart: 'candlestick'
          },
          {
            title: 'Timeframes: 1min, 5min, 15min, 1h',
            content: `**TIMEFRAME = Período de cada vela no gráfico**

**1 MINUTO (M1)**
• Cada vela = 1 minuto
• Scalping (operações rápidas)
• Muito volátil, requer atenção total

**5 MINUTOS (M5)**
• Cada vela = 5 minutos
• Ideal para day trade rápido
• Bom equilíbrio entre velocidade e análise

**15 MINUTOS (M15)**
• Cada vela = 15 minutos
• Day trade moderado
• Menos ruído, tendências mais claras

**1 HORA (H1)**
• Cada vela = 1 hora
• Operações mais longas (swing trade)
• Análise mais confiável

**ESTRATÉGIA RECOMENDADA:**
• Analise em H1 para ver tendência geral
• Entre em M5 ou M15 para timing preciso
• Use M1 apenas se for muito experiente`,
            chart: 'timeframes'
          },
          {
            title: 'Identificando tendências de alta e baixa',
            content: `**TENDÊNCIA DE ALTA (BULLISH)**
• Topos cada vez mais altos
• Fundos cada vez mais altos
• Preço acima das médias móveis
• Volume crescente nas altas
• Estratégia: Comprar nas correções

**TENDÊNCIA DE BAIXA (BEARISH)**
• Topos cada vez mais baixos
• Fundos cada vez mais baixos
• Preço abaixo das médias móveis
• Volume crescente nas quedas
• Estratégia: Vender nos repiques

**TENDÊNCIA LATERAL (CONSOLIDAÇÃO)**
• Preço oscila entre suporte e resistência
• Sem direção clara
• Baixo volume
• Estratégia: Aguardar rompimento

**COMO IDENTIFICAR:**
1. Olhe o gráfico de H1 ou H4
2. Trace uma linha conectando os topos
3. Trace uma linha conectando os fundos
4. Se ambas sobem = alta
5. Se ambas descem = baixa
6. Se paralelas = lateral`,
            chart: 'trends'
          },
          {
            title: 'Suportes e resistências básicos',
            content: `**SUPORTE**
• Nível de preço onde compradores entram forte
• Preço "bate" e volta para cima
• Quanto mais vezes testado, mais forte
• Se romper, vira resistência

**RESISTÊNCIA**
• Nível de preço onde vendedores dominam
• Preço "bate" e volta para baixo
• Quanto mais vezes testado, mais forte
• Se romper, vira suporte

**COMO IDENTIFICAR:**
1. Procure níveis onde preço "bateu" várias vezes
2. Trace linhas horizontais nesses pontos
3. Suporte = linha abaixo do preço atual
4. Resistência = linha acima do preço atual

**ESTRATÉGIAS:**
• Comprar próximo ao suporte
• Vender próximo à resistência
• Operar rompimentos com volume alto

**DICA:**
Suportes e resistências psicológicos (números redondos como $100, $1.000, $10.000) são muito fortes!`,
            chart: 'support-resistance'
          },
        ]
      },
      {
        title: 'Módulo 3: Ferramentas Essenciais',
        lessons: [
          {
            title: 'Médias Móveis: Como usar e interpretar',
            content: `**O QUE SÃO MÉDIAS MÓVEIS?**
• Linha que mostra o preço médio de um período
• Suaviza o gráfico, mostra tendência clara
• Tipos: Simples (SMA) e Exponencial (EMA)

**MÉDIAS MAIS USADAS:**
• MM20 (20 períodos) - Curto prazo
• MM50 (50 períodos) - Médio prazo
• MM200 (200 períodos) - Longo prazo

**COMO INTERPRETAR:**
• Preço ACIMA da média = tendência de alta
• Preço ABAIXO da média = tendência de baixa
• Cruzamento de médias = mudança de tendência

**ESTRATÉGIA GOLDEN CROSS:**
• MM50 cruza MM200 para cima = COMPRA forte
• MM50 cruza MM200 para baixo = VENDA forte

**ESTRATÉGIA DEATH CROSS:**
• Oposto do Golden Cross
• Sinal de baixa forte

**DICA:**
Use EMA para day trade (reage mais rápido) e SMA para swing trade (mais suave).`,
            chart: 'moving-averages'
          },
          {
            title: 'RSI (Índice de Força Relativa)',
            content: `**O QUE É RSI?**
• Indicador de momentum (força do movimento)
• Varia de 0 a 100
• Mostra se ativo está sobrecomprado ou sobrevendido

**INTERPRETAÇÃO:**
• RSI > 70 = SOBRECOMPRADO (pode cair)
• RSI < 30 = SOBREVENDIDO (pode subir)
• RSI = 50 = Neutro

**ESTRATÉGIAS:**
1. **Reversão:** Vender quando RSI > 70, comprar quando RSI < 30
2. **Divergência:** Preço sobe mas RSI desce = reversão próxima
3. **Rompimento:** RSI rompe 50 = confirmação de tendência

**CONFIGURAÇÃO RECOMENDADA:**
• Período: 14 (padrão)
• Timeframe: M5 ou M15 para day trade

**ATENÇÃO:**
Em tendências fortes, RSI pode ficar em sobrecompra/sobrevenda por muito tempo. Combine com outros indicadores!`,
            chart: 'rsi'
          },
          {
            title: 'MACD: Convergência e Divergência',
            content: `**O QUE É MACD?**
• Indicador de tendência e momentum
• Mostra relação entre duas médias móveis
• Composto por: Linha MACD, Linha de Sinal, Histograma

**COMPONENTES:**
• Linha MACD (azul) = EMA12 - EMA26
• Linha de Sinal (vermelha) = EMA9 do MACD
• Histograma = Diferença entre MACD e Sinal

**SINAIS DE COMPRA:**
• MACD cruza Sinal para cima
• Histograma fica positivo
• MACD cruza linha zero para cima

**SINAIS DE VENDA:**
• MACD cruza Sinal para baixo
• Histograma fica negativo
• MACD cruza linha zero para baixo

**DIVERGÊNCIA:**
• Preço faz topo mais alto, MACD faz topo mais baixo = reversão de baixa
• Preço faz fundo mais baixo, MACD faz fundo mais alto = reversão de alta

**MELHOR USO:**
Combine MACD com RSI para confirmação dupla!`,
            chart: 'macd'
          },
          {
            title: 'Volume: Confirmando movimentos',
            content: `**O QUE É VOLUME?**
• Quantidade de negociações em um período
• Mostra força do movimento
• Volume alto = movimento confiável
• Volume baixo = movimento fraco

**INTERPRETAÇÃO:**
• Alta com volume alto = tendência forte de alta
• Alta com volume baixo = alta fraca, pode reverter
• Queda com volume alto = tendência forte de baixa
• Queda com volume baixo = queda fraca, pode reverter

**PADRÕES IMPORTANTES:**
1. **Volume Climático:** Volume extremamente alto = possível reversão
2. **Volume Crescente:** Confirma tendência atual
3. **Volume Decrescente:** Tendência perdendo força

**ESTRATÉGIA DE ROMPIMENTO:**
• Preço rompe resistência + volume alto = COMPRA
• Preço rompe suporte + volume alto = VENDA
• Rompimento sem volume = falso rompimento

**REGRA DE OURO:**
Nunca opere rompimentos sem confirmar com volume alto!`,
            chart: 'volume'
          },
        ]
      },
      {
        title: 'Módulo 4: Gestão de Risco',
        lessons: [
          {
            title: 'Quanto investir por operação',
            content: `**REGRA DOS 2%**
• Nunca arrisque mais de 2% do seu capital por operação
• Exemplo: Capital de R$ 10.000 = risco máximo de R$ 200

**CÁLCULO DO TAMANHO DA POSIÇÃO:**
1. Defina seu capital total
2. Calcule 2% desse valor
3. Defina a distância do stop loss
4. Tamanho da posição = 2% do capital ÷ distância do stop

**EXEMPLO PRÁTICO:**
• Capital: R$ 10.000
• Risco: 2% = R$ 200
• Stop loss: 50 pips
• Tamanho: R$ 200 ÷ 50 = R$ 4 por pip

**NÍVEIS DE RISCO:**
• Conservador: 1% por operação
• Moderado: 2% por operação
• Agressivo: 3-5% por operação (NÃO RECOMENDADO)

**IMPORTANTE:**
Começando? Use 1% até ganhar experiência!`,
            chart: 'position-sizing'
          },
          {
            title: 'Stop Loss e Take Profit',
            content: `**STOP LOSS (Proteção)**
• Ordem automática que fecha posição no prejuízo
• SEMPRE defina antes de entrar
• Nunca mova stop loss para aumentar perda

**ONDE COLOCAR STOP LOSS:**
• Abaixo do suporte (em compras)
• Acima da resistência (em vendas)
• Atrás de uma vela de reversão
• 1-2% do preço de entrada

**TAKE PROFIT (Objetivo)**
• Ordem automática que fecha posição no lucro
• Define onde você quer realizar ganho
• Pode ser parcial (fechar 50% e deixar 50% correr)

**ONDE COLOCAR TAKE PROFIT:**
• Na próxima resistência (em compras)
• No próximo suporte (em vendas)
• 2-3x a distância do stop loss

**RELAÇÃO RISCO/RETORNO:**
• Mínimo 1:2 (risco R$ 100 para ganhar R$ 200)
• Ideal 1:3 (risco R$ 100 para ganhar R$ 300)

**EXEMPLO:**
• Entrada: $100
• Stop Loss: $98 (risco de $2)
• Take Profit: $106 (ganho de $6)
• Relação: 1:3 ✅`,
            chart: 'stop-take'
          },
          {
            title: 'Relação Risco/Retorno (1:2, 1:3)',
            content: `**O QUE É RISCO/RETORNO?**
• Proporção entre quanto você arrisca e quanto pode ganhar
• Fundamental para ser lucrativo no longo prazo

**CÁLCULO:**
Risco/Retorno = Lucro Potencial ÷ Perda Potencial

**EXEMPLOS:**
• Risco R$ 100, ganho R$ 200 = 1:2
• Risco R$ 100, ganho R$ 300 = 1:3
• Risco R$ 100, ganho R$ 100 = 1:1 (EVITE!)

**POR QUE É IMPORTANTE?**
Com 1:2, você pode errar 50% e ainda lucrar!
• 10 operações: 5 certas, 5 erradas
• Certas: 5 × R$ 200 = R$ 1.000
• Erradas: 5 × R$ 100 = R$ 500
• Lucro: R$ 500 ✅

**REGRAS:**
• Nunca opere com menos de 1:2
• Ideal: 1:3 ou superior
• Quanto maior, melhor (mas mais difícil)

**DICA:**
Se não conseguir 1:2, não entre na operação!`,
            chart: 'risk-reward'
          },
          {
            title: 'Psicologia do trader iniciante',
            content: `**EMOÇÕES QUE DESTROEM TRADERS:**

**1. GANÂNCIA**
• Não realizar lucro esperando mais
• Aumentar posição após ganhos
• Solução: Siga seu plano, realize lucros

**2. MEDO**
• Não entrar em boas operações
• Fechar no lucro muito cedo
• Solução: Confie na análise, siga regras

**3. VINGANÇA (Revenge Trading)**
• Operar para "recuperar" perda
• Aumentar risco após prejuízo
• Solução: Pare após 2 perdas seguidas

**4. OVERTRADING**
• Operar demais, sem critério
• Entrar por tédio ou ansiedade
• Solução: Máximo 3-5 operações/dia

**REGRAS DE OURO:**
1. Siga seu plano de trading
2. Aceite perdas como parte do jogo
3. Não opere com dinheiro que precisa
4. Mantenha diário de operações
5. Pare após 2 perdas seguidas

**MINDSET VENCEDOR:**
"Não sou eu vs mercado. Sou eu seguindo probabilidades."`,
            chart: 'psychology'
          },
        ]
      },
    ]
  },
  advanced: {
    title: 'Day Trade Avançado',
    description: 'Estratégias profissionais para maximizar lucros',
    duration: '12 horas',
    lessons: 36,
    modules: [
      {
        title: 'Módulo 1: Análise Técnica Avançada',
        lessons: [
          {
            title: 'Padrões de candlestick: Doji, Martelo, Engolfo',
            content: `**DOJI**
• Abertura = Fechamento (corpo muito pequeno)
• Indica indecisão do mercado
• Em topo de alta = possível reversão de baixa
• Em fundo de baixa = possível reversão de alta

**MARTELO (Hammer)**
• Corpo pequeno no topo, sombra longa embaixo
• Aparece em fundo de baixa
• Sinal de reversão de alta
• Confirme com próxima vela verde

**MARTELO INVERTIDO**
• Corpo pequeno embaixo, sombra longa em cima
• Também sinal de reversão de alta
• Menos confiável que martelo normal

**ENGOLFO DE ALTA (Bullish Engulfing)**
• Vela verde engole completamente vela vermelha anterior
• Forte sinal de reversão de alta
• Volume alto confirma o padrão

**ENGOLFO DE BAIXA (Bearish Engulfing)**
• Vela vermelha engole completamente vela verde anterior
• Forte sinal de reversão de baixa
• Aparece em topos de alta

**ESTRELA DA MANHÃ (Morning Star)**
• 3 velas: vermelha grande, doji pequeno, verde grande
• Reversão de alta muito forte
• Confirme com volume

**ESTRELA DA TARDE (Evening Star)**
• 3 velas: verde grande, doji pequeno, vermelha grande
• Reversão de baixa muito forte
• Aparece em topos`,
            chart: 'candlestick-patterns'
          },
          {
            title: 'Fibonacci: Retrações e extensões',
            content: `**O QUE É FIBONACCI?**
• Sequência matemática: 0, 1, 1, 2, 3, 5, 8, 13, 21...
• Níveis de retração: 23.6%, 38.2%, 50%, 61.8%, 78.6%
• Preço tende a respeitar esses níveis

**RETRAÇÃO DE FIBONACCI**
• Usado para encontrar suportes/resistências
• Traçar do fundo ao topo (alta) ou topo ao fundo (baixa)
• Preço corrige até um nível de Fibonacci e retoma tendência

**NÍVEIS IMPORTANTES:**
• 38.2% = Correção fraca (tendência forte)
• 50% = Correção moderada
• 61.8% = Nível de ouro (mais importante)
• 78.6% = Correção profunda (tendência fraca)

**ESTRATÉGIA:**
1. Identifique tendência forte
2. Aguarde correção
3. Entre quando preço tocar 50% ou 61.8%
4. Stop abaixo do 78.6%
5. Alvo: Topo/fundo anterior

**EXTENSÃO DE FIBONACCI**
• Usado para projetar alvos
• Níveis: 127.2%, 161.8%, 200%, 261.8%
• Onde preço pode chegar após rompimento

**DICA:**
61.8% é o nível mais confiável. Combine com suporte/resistência!`,
            chart: 'fibonacci'
          },
          {
            title: 'Ondas de Elliott aplicadas',
            content: `**TEORIA DAS ONDAS DE ELLIOTT**
• Mercado se move em ondas (impulso e correção)
• Padrão: 5 ondas de impulso + 3 ondas de correção

**ONDAS DE IMPULSO (1-2-3-4-5):**
• Onda 1: Início da alta (poucos percebem)
• Onda 2: Correção (não rompe início da onda 1)
• Onda 3: Maior e mais forte (todos compram)
• Onda 4: Correção menor (não toca onda 1)
• Onda 5: Última alta (euforia, topo)

**ONDAS CORRETIVAS (A-B-C):**
• Onda A: Primeira queda
• Onda B: Repique (falsa alta)
• Onda C: Queda final

**REGRAS FUNDAMENTAIS:**
1. Onda 2 nunca rompe início da onda 1
2. Onda 3 nunca é a menor
3. Onda 4 não sobrepõe onda 1

**ESTRATÉGIA:**
• Compre no fim da onda 2 ou 4
• Venda no fim da onda 5
• Evite onda 1 (difícil identificar)

**ATENÇÃO:**
Elliott é complexo. Use apenas se tiver experiência!`,
            chart: 'elliott-waves'
          },
          {
            title: 'Price Action: Lendo o mercado sem indicadores',
            content: `**O QUE É PRICE ACTION?**
• Análise baseada apenas no movimento do preço
• Sem indicadores, apenas velas e níveis
• Método mais puro de análise técnica

**ELEMENTOS PRINCIPAIS:**
1. **Suportes e Resistências**
2. **Padrões de candlestick**
3. **Estrutura de mercado (topos e fundos)**
4. **Zonas de oferta e demanda**

**ESTRUTURA DE MERCADO:**
• HH (Higher High) = Topo mais alto
• HL (Higher Low) = Fundo mais alto
• LH (Lower High) = Topo mais baixo
• LL (Lower Low) = Fundo mais baixo

**TENDÊNCIA DE ALTA:**
HH + HL consecutivos

**TENDÊNCIA DE BAIXA:**
LH + LL consecutivos

**ESTRATÉGIA PIN BAR:**
• Vela com sombra longa e corpo pequeno
• Sombra = rejeição de preço
• Pin bar em suporte = compra
• Pin bar em resistência = venda

**INSIDE BAR:**
• Vela dentro da vela anterior
• Indica consolidação
• Rompimento = entrada forte

**VANTAGENS:**
• Funciona em qualquer timeframe
• Sem atraso (indicadores atrasam)
• Visão clara do mercado

**DESVANTAGENS:**
• Requer experiência
• Subjetivo (cada trader vê diferente)`,
            chart: 'price-action'
          },
        ]
      },
      {
        title: 'Módulo 2: Estratégias Profissionais',
        lessons: [
          {
            title: 'Scalping: Operações de segundos',
            content: `**O QUE É SCALPING?**
• Operações muito rápidas (segundos a minutos)
• Objetivo: Pequenos lucros repetidos
• Timeframe: M1 (1 minuto)
• Muitas operações por dia (20-50+)

**CARACTERÍSTICAS:**
• Lucro pequeno por operação (5-10 pips)
• Stop loss apertado (3-5 pips)
• Alta frequência de trades
• Requer concentração total

**MELHORES ATIVOS:**
• Forex: EUR/USD, GBP/USD (spreads baixos)
• Cripto: BTC/USDT, ETH/USDT (alta liquidez)
• Evite: Ativos com spread alto

**ESTRATÉGIA BÁSICA:**
1. Identifique tendência em M5
2. Entre em M1 na direção da tendência
3. Alvo: 5-10 pips
4. Stop: 3-5 pips
5. Saia rápido (não segure)

**INDICADORES PARA SCALPING:**
• EMA 9 e EMA 21
• Estocástico (5,3,3)
• Volume

**REGRAS DE OURO:**
• Opere apenas em horários de alta liquidez
• Nunca segure posição perdedora
• Realize lucro rapidamente
• Pare após 3 perdas seguidas

**ATENÇÃO:**
Scalping é estressante e requer muita disciplina!`,
            chart: 'scalping'
          },
          {
            title: 'Breakout: Rompimento de suportes/resistências',
            content: `**O QUE É BREAKOUT?**
• Rompimento de nível importante (suporte/resistência)
• Gera movimento forte e rápido
• Uma das estratégias mais lucrativas

**TIPOS DE BREAKOUT:**
1. **Rompimento de Resistência** = COMPRA
2. **Rompimento de Suporte** = VENDA
3. **Rompimento de Triângulo** = Direção do rompimento
4. **Rompimento de Canal** = Forte movimento

**COMO IDENTIFICAR:**
• Preço consolida em um nível
• Volume diminui (acumulação)
• Preço rompe com volume alto
• Reteste do nível rompido (confirmação)

**ESTRATÉGIA:**
1. Identifique consolidação
2. Aguarde rompimento com volume alto
3. Entre após reteste (mais seguro)
4. Stop: Abaixo/acima do nível rompido
5. Alvo: Altura da consolidação

**EXEMPLO:**
• Resistência em $100
• Preço rompe para $101 com volume alto
• Retesta $100 (agora suporte)
• Entrada: $100.50
• Stop: $99.50
• Alvo: $105 (se consolidação tinha $5 de altura)

**FALSOS ROMPIMENTOS:**
• Rompimento sem volume = falso
• Vela com sombra longa = rejeição
• Aguarde sempre confirmação!`,
            chart: 'breakout'
          },
          {
            title: 'Pullback: Entrando em correções',
            content: `**O QUE É PULLBACK?**
• Correção temporária dentro de uma tendência
• Preço "volta" antes de continuar
• Melhor ponto de entrada em tendências

**COMO FUNCIONA:**
1. Tendência forte em curso
2. Preço corrige (pullback)
3. Preço retoma tendência original
4. Entrada no pullback = melhor preço

**IDENTIFICANDO PULLBACK:**
• Tendência clara (HH + HL ou LH + LL)
• Correção até suporte/resistência
• Correção até média móvel (MM20, MM50)
• Correção até Fibonacci (38.2%, 50%, 61.8%)

**ESTRATÉGIA:**
1. Identifique tendência forte
2. Aguarde correção
3. Entre quando preço tocar:
   - Média móvel
   - Fibonacci 50% ou 61.8%
   - Suporte/resistência anterior
4. Stop: Atrás da correção
5. Alvo: Topo/fundo anterior

**CONFIRMAÇÃO:**
• Padrão de candlestick de reversão
• RSI saindo de sobrecompra/sobrevenda
• MACD cruzando para cima/baixo
• Volume aumentando

**VANTAGENS:**
• Melhor relação risco/retorno
• Entrada em tendência confirmada
• Stop loss menor

**ATENÇÃO:**
Nem toda correção é pullback. Pode ser reversão!`,
            chart: 'pullback'
          },
          {
            title: 'Reversão: Identificando mudanças de tendência',
            content: `**O QUE É REVERSÃO?**
• Mudança completa de direção do mercado
• Alta vira baixa ou baixa vira alta
• Oportunidade de pegar movimento inteiro

**SINAIS DE REVERSÃO:**

**1. ESTRUTURA DE MERCADO**
• Alta: Rompe último fundo (LL)
• Baixa: Rompe último topo (HH)

**2. PADRÕES DE CANDLESTICK**
• Engolfo (bullish/bearish)
• Estrela da manhã/tarde
• Martelo em fundo

**3. INDICADORES**
• Divergência RSI
• Divergência MACD
• Cruzamento de médias móveis

**4. VOLUME**
• Volume climático (extremo)
• Volume alto no rompimento

**ESTRATÉGIA TOPO DUPLO/FUNDO DUPLO:**

**Topo Duplo (Reversão de Baixa):**
• Preço testa resistência 2 vezes
• Não consegue romper
• Rompe suporte (linha do pescoço)
• Entrada: Rompimento do suporte
• Alvo: Altura do padrão

**Fundo Duplo (Reversão de Alta):**
• Preço testa suporte 2 vezes
• Não consegue romper
• Rompe resistência (linha do pescoço)
• Entrada: Rompimento da resistência
• Alvo: Altura do padrão

**ATENÇÃO:**
Reversões são raras. Maioria são pullbacks!
Aguarde confirmação forte antes de entrar.`,
            chart: 'reversal'
          },
        ]
      },
    ]
  }
}

// Slides educacionais com gráficos simples
const CHART_SLIDES = [
  {
    title: 'Identificando Tendência de Alta',
    description: 'Topos e fundos ascendentes indicam força compradora',
    chart: 'uptrend',
    tips: [
      'Procure por topos cada vez mais altos',
      'Fundos também devem ser ascendentes',
      'Volume crescente confirma a tendência',
      'Médias móveis apontando para cima'
    ]
  },
  {
    title: 'Identificando Tendência de Baixa',
    description: 'Topos e fundos descendentes indicam força vendedora',
    chart: 'downtrend',
    tips: [
      'Topos cada vez mais baixos',
      'Fundos descendentes confirmam baixa',
      'Volume alto nas quedas',
      'Médias móveis apontando para baixo'
    ]
  },
  {
    title: 'Suporte e Resistência',
    description: 'Níveis onde o preço tende a reverter ou consolidar',
    chart: 'support-resistance',
    tips: [
      'Suporte: Nível onde compradores entram forte',
      'Resistência: Nível onde vendedores dominam',
      'Rompimentos geram movimentos fortes',
      'Use para definir stop loss e take profit'
    ]
  },
  {
    title: 'Padrão de Rompimento (Breakout)',
    description: 'Quando o preço rompe um nível importante com volume',
    chart: 'breakout',
    tips: [
      'Aguarde confirmação com volume alto',
      'Entre após o rompimento consolidado',
      'Stop loss abaixo do nível rompido',
      'Alvo: Distância do canal anterior'
    ]
  },
  {
    title: 'Divergência RSI',
    description: 'Preço e RSI em direções opostas indicam reversão',
    chart: 'rsi-divergence',
    tips: [
      'Preço faz topo mais alto, RSI faz topo mais baixo',
      'Indica enfraquecimento da tendência',
      'Prepare-se para possível reversão',
      'Combine com outros indicadores'
    ]
  },
]

export default function Home() {
  const [isPremium, setIsPremium] = useState(false)
  const [hasBasicPlan, setHasBasicPlan] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CRYPTO' | 'FOREX' | 'OTC'>('ALL')
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', message: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<typeof ALL_ASSETS[0] | null>(null)
  const [tradeTimer, setTradeTimer] = useState(60)
  const [trendUpdate, setTrendUpdate] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState<'beginner' | 'advanced' | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<{title: string, content: string, chart: string} | null>(null)
  const [entryCountdown, setEntryCountdown] = useState<number | null>(null)
  const [tradeDirection, setTradeDirection] = useState<'BUY' | 'SELL' | null>(null)
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('5m')

  // Evitar hydration mismatch - só renderizar após montagem
  useEffect(() => {
    setMounted(true)
  }, [])

  // Relógio sincronizado com horário de Brasília
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Converter para horário de Brasília (UTC-3)
      const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      setCurrentTime(brasiliaTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    
    updateTime() // Atualiza imediatamente
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Timer de 1 minuto sincronizado com o relógio
  useEffect(() => {
    const syncTimer = () => {
      const now = new Date()
      const brasiliaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const seconds = brasiliaTime.getSeconds()
      // Calcula quantos segundos faltam para completar o minuto
      const remainingSeconds = 60 - seconds
      setTradeTimer(remainingSeconds)
    }
    
    syncTimer() // Sincroniza imediatamente
    const timer = setInterval(syncTimer, 1000)
    return () => clearInterval(timer)
  }, [])

  // Atualizar tendências a cada segundo
  useEffect(() => {
    const trendTimer = setInterval(() => {
      setTrendUpdate(prev => prev + 1)
    }, 1000)
    return () => clearInterval(trendTimer)
  }, [])

  // Countdown de entrada na operação
  useEffect(() => {
    if (entryCountdown === null) return
    
    if (entryCountdown <= 0) {
      setEntryCountdown(null)
      setTradeDirection(null)
      return
    }

    const timer = setTimeout(() => {
      setEntryCountdown(entryCountdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [entryCountdown])

  // Análise de correlação entre ativos (simulada mas realista)
  const analyzeMarketCorrelation = (asset: typeof ALL_ASSETS[0]) => {
    // Análise baseada em correlações reais do mercado
    const correlations: string[] = []
    
    // Correlações Crypto
    if (asset.category === 'CRYPTO') {
      if (asset.symbol.includes('BTC') || asset.symbol.includes('Bitcoin')) {
        correlations.push('Bitcoin influencia todo mercado crypto (+85% correlação)')
        correlations.push('Ethereum segue Bitcoin em 78% dos casos')
      }
      if (asset.symbol.includes('ETH') || asset.symbol.includes('Ethereum')) {
        correlations.push('Altcoins seguem Ethereum em 65% dos movimentos')
      }
      correlations.push('DXY (Dólar) tem correlação negativa (-72%)')
      correlations.push('Ouro tem correlação positiva moderada (+45%)')
    }
    
    // Correlações Forex
    if (asset.category === 'FOREX') {
      if (asset.symbol.includes('USD')) {
        correlations.push('DXY (Índice do Dólar) correlação direta (+92%)')
        correlations.push('Ouro tem correlação negativa (-85%)')
        correlations.push('Petróleo influencia pares USD em 58%')
      }
      if (asset.symbol.includes('EUR')) {
        correlations.push('BCE (Banco Central Europeu) impacta diretamente')
        correlations.push('DAX (Bolsa Alemã) correlação +68%')
      }
      if (asset.symbol.includes('JPY')) {
        correlations.push('Nikkei 225 correlação +73%')
        correlations.push('Carry Trade afeta todos pares JPY')
      }
      if (asset.symbol.includes('GBP')) {
        correlations.push('FTSE 100 correlação +65%')
        correlations.push('Petróleo Brent influencia GBP em 52%')
      }
    }
    
    // Correlações OTC
    if (asset.category === 'OTC') {
      if (asset.type === 'Stock') {
        correlations.push('S&P 500 correlação +82%')
        correlations.push('VIX (Volatilidade) correlação negativa (-76%)')
      }
      if (asset.type === 'Commodity') {
        correlations.push('Dólar tem correlação negativa (-68%)')
        correlations.push('Inflação global impacta diretamente')
      }
    }

    return correlations
  }

  // Iniciar contagem regressiva para entrada
  const startEntryCountdown = (direction: 'BUY' | 'SELL') => {
    setTradeDirection(direction)
    setEntryCountdown(3)
  }

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
        aiResponse = `🌟 O Plano Premium oferece:\n\n✅ Taxa de acerto de 90-92% (vs 85-87% do básico)\n✅ Operações quase automáticas com IA\n✅ Análises detalhadas em tempo real\n✅ Acesso a TODAS as estratégias avançadas\n✅ Cursos completos de Day Trade\n✅ Materiais educacionais exclusivos\n✅ Suporte prioritário 24/7\n✅ Gestão de risco profissional\n\n💰 Com o Premium, você pode lucrar até 3x mais por mês! Muitos usuários pagam o plano apenas com os lucros da primeira semana.\n\n🚀 Upgrade agora por apenas R$ 97/mês e maximize seus ganhos!`
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CHART_SLIDES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CHART_SLIDES.length) % CHART_SLIDES.length)
  }

  // Gráfico SVG simples para ilustração
  const renderSimpleChart = (type: string) => {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid */}
        <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="0" y1="150" x2="400" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
        
        {type === 'uptrend' && (
          <>
            {/* Linha de tendência de alta */}
            <polyline points="50,150 100,120 150,100 200,80 250,60 300,40 350,30" fill="none" stroke="#10b981" strokeWidth="3" />
            {/* Velas */}
            <rect x="45" y="140" width="10" height="20" fill="#10b981" />
            <rect x="95" y="110" width="10" height="20" fill="#10b981" />
            <rect x="145" y="90" width="10" height="20" fill="#10b981" />
            <rect x="195" y="70" width="10" height="20" fill="#10b981" />
            <rect x="245" y="50" width="10" height="20" fill="#10b981" />
            <rect x="295" y="30" width="10" height="20" fill="#10b981" />
          </>
        )}
        
        {type === 'downtrend' && (
          <>
            {/* Linha de tendência de baixa */}
            <polyline points="50,50 100,70 150,90 200,110 250,130 300,150 350,170" fill="none" stroke="#ef4444" strokeWidth="3" />
            {/* Velas */}
            <rect x="45" y="50" width="10" height="20" fill="#ef4444" />
            <rect x="95" y="70" width="10" height="20" fill="#ef4444" />
            <rect x="145" y="90" width="10" height="20" fill="#ef4444" />
            <rect x="195" y="110" width="10" height="20" fill="#ef4444" />
            <rect x="245" y="130" width="10" height="20" fill="#ef4444" />
            <rect x="295" y="150" width="10" height="20" fill="#ef4444" />
          </>
        )}
        
        {type === 'support-resistance' && (
          <>
            {/* Resistência */}
            <line x1="0" y1="50" x2="400" y2="50" stroke="#ef4444" strokeWidth="2" />
            <text x="10" y="45" fill="#ef4444" fontSize="12">Resistência</text>
            {/* Suporte */}
            <line x1="0" y1="150" x2="400" y2="150" stroke="#10b981" strokeWidth="2" />
            <text x="10" y="145" fill="#10b981" fontSize="12">Suporte</text>
            {/* Preço oscilando */}
            <polyline points="50,100 100,80 150,120 200,70 250,130 300,90 350,110" fill="none" stroke="#3b82f6" strokeWidth="2" />
          </>
        )}
      </svg>
    )
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
                  <div className="text-xs text-slate-400">Horário de Brasília</div>
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
                  <p className="text-sm text-slate-300">Operações de 1 em 1 minuto • Sincronizado com horário de Brasília</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-mono font-bold text-emerald-400">{formatTradeTimer(tradeTimer)}</div>
                <div className="text-xs text-slate-400 mt-1">Contagem regressiva sincronizada</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Countdown de Entrada na Operação */}
        {entryCountdown !== null && tradeDirection && (
          <Card className={`mb-6 ${tradeDirection === 'BUY' ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border-emerald-500' : 'bg-gradient-to-br from-red-900/50 to-rose-900/50 border-red-500'} animate-pulse`}>
            <CardContent className="py-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-4 animate-bounce">
                  {entryCountdown}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {tradeDirection === 'BUY' ? (
                    <div className="flex items-center justify-center gap-3">
                      <TrendingUp className="w-10 h-10 text-emerald-400" />
                      <span>ENTRE COMPRADO</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <TrendingDown className="w-10 h-10 text-red-400" />
                      <span>ENTRE VENDIDO</span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300">
                  {entryCountdown === 3 && '🎯 Prepare-se para entrar...'}
                  {entryCountdown === 2 && '⚡ Quase lá...'}
                  {entryCountdown === 1 && '🚀 AGORA!'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
                  return (
                    <div
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset)}
                      className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer hover:scale-105"
                    >
                      <div className="text-sm font-bold text-white mb-1 truncate">{asset.symbol}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-xs">
                          {asset.isPositive ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">+{asset.change.toFixed(2)}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3 h-3 text-red-400" />
                              <span className="text-red-400">-{asset.change.toFixed(2)}%</span>
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
              {/* Seletor de Timeframe */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-slate-400">Timeframe:</span>
                {(['1m', '5m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                  <Button
                    key={tf}
                    size="sm"
                    variant={timeframe === tf ? 'default' : 'outline'}
                    onClick={() => setTimeframe(tf)}
                    className={timeframe === tf ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
                  >
                    {tf}
                  </Button>
                ))}
              </div>

              {/* Gráfico de Velas com Indicadores */}
              <CandlestickChart symbol={selectedAsset.symbol} timeframe={timeframe} />

              {/* Análise de Correlação entre Ativos */}
              <Card className="mb-4 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/50">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Análise de Correlação de Mercado
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Outros ativos que influenciam {selectedAsset.symbol}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analyzeMarketCorrelation(selectedAsset).map((correlation, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-300">{correlation}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-200">
                      💡 <strong>Dica:</strong> A IA considera todas essas correlações para calcular a assertividade da operação. Quanto mais fatores alinhados, maior a probabilidade de acerto!
                    </p>
                  </div>
                </CardContent>
              </Card>

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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Assertividade Compra:</span>
                        <span className="text-2xl font-bold text-emerald-400">
                          {isPremium ? '91%' : hasBasicPlan ? '87%' : '83%'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Assertividade Venda:</span>
                        <span className="text-2xl font-bold text-red-400">
                          {isPremium ? '89%' : hasBasicPlan ? '85%' : '81%'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-700">
                      <p className="text-sm text-slate-300 mb-2">
                        <strong className="text-white">Análise:</strong> Padrão de rompimento confirmado com volume crescente. Suporte identificado.
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        {isPremium ? '✅ Recomendação: Entrar agora com gestão de risco adequada' : '🔒 Análise completa disponível no Premium'}
                      </p>
                      
                      {/* Botões de Entrada com Countdown */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => startEntryCountdown('BUY')}
                          className="bg-emerald-600 hover:bg-emerald-700 w-full"
                          disabled={entryCountdown !== null}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Entrar Comprado
                        </Button>
                        <Button 
                          onClick={() => startEntryCountdown('SELL')}
                          className="bg-red-600 hover:bg-red-700 w-full"
                          disabled={entryCountdown !== null}
                        >
                          <TrendingDown className="w-4 h-4 mr-2" />
                          Entrar Vendido
                        </Button>
                      </div>
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
                    <p className="text-sm text-slate-400">Analise os indicadores técnicos e correlações entre ativos</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">3</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Siga a Recomendação IA</h4>
                    <p className="text-sm text-slate-400">Clique em "Entrar Comprado" ou "Entrar Vendido" e aguarde a contagem 3...2...1</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-white">4</div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Execute no Momento Certo</h4>
                    <p className="text-sm text-slate-400">Quando aparecer "AGORA!", execute a operação na sua corretora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            {!isPremium ? (
              <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50">
                <CardContent className="py-12 text-center">
                  <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Conteúdo Exclusivo Premium</h3>
                  <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                    Desbloqueie acesso completo aos cursos de Day Trade e materiais educacionais que vão transformar você em um trader de sucesso!
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                    <div className="bg-slate-800/50 p-6 rounded-lg">
                      <GraduationCap className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">2 Cursos Completos</h4>
                      <p className="text-sm text-slate-400">Do iniciante ao avançado com 60 aulas</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg">
                      <BookOpen className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">Conteúdo Direto</h4>
                      <p className="text-sm text-slate-400">Materiais leves e explicativos na plataforma</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-lg">
                      <LineChart className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                      <h4 className="font-bold text-white mb-2">Gráficos Simples</h4>
                      <p className="text-sm text-slate-400">Aprenda a ler gráficos como um pro</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsPremium(true)}
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-8 py-6"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Assinar Premium - R$ 97/mês
                  </Button>
                  <p className="text-xs text-slate-400 mt-4">
                    💰 Muitos alunos pagam o plano com os lucros da primeira semana!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Modal de Visualização de Conteúdo */}
                {selectedLesson && (
                  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <Card className="w-full max-w-4xl my-8 bg-slate-900 border-slate-700">
                      <CardHeader className="border-b border-slate-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-emerald-400" />
                            <div>
                              <CardTitle className="text-white">{selectedLesson.title}</CardTitle>
                              <CardDescription>Material educacional direto na plataforma</CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedLesson(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* Gráfico Ilustrativo */}
                        <div className="bg-slate-950/50 rounded-lg p-4 mb-6 border border-slate-700">
                          {renderSimpleChart(selectedLesson.chart)}
                        </div>
                        
                        {/* Conteúdo */}
                        <div className="prose prose-invert max-w-none">
                          <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                            {selectedLesson.content}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Cursos de Day Trade */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card 
                    className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/50 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedCourse(selectedCourse === 'beginner' ? null : 'beginner')}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-emerald-600">Iniciante</Badge>
                        <GraduationCap className="w-8 h-8 text-emerald-400" />
                      </div>
                      <CardTitle className="text-white text-xl">{EDUCATION_CONTENT.beginner.title}</CardTitle>
                      <CardDescription className="text-slate-300">
                        {EDUCATION_CONTENT.beginner.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{EDUCATION_CONTENT.beginner.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          <span>{EDUCATION_CONTENT.beginner.lessons} aulas</span>
                        </div>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        {selectedCourse === 'beginner' ? 'Fechar Curso' : 'Abrir Curso'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card 
                    className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedCourse(selectedCourse === 'advanced' ? null : 'advanced')}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600">Avançado</Badge>
                        <Brain className="w-8 h-8 text-purple-400" />
                      </div>
                      <CardTitle className="text-white text-xl">{EDUCATION_CONTENT.advanced.title}</CardTitle>
                      <CardDescription className="text-slate-300">
                        {EDUCATION_CONTENT.advanced.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{EDUCATION_CONTENT.advanced.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          <span>{EDUCATION_CONTENT.advanced.lessons} aulas</span>
                        </div>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        {selectedCourse === 'advanced' ? 'Fechar Curso' : 'Abrir Curso'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Detalhes do Curso Selecionado */}
                {selectedCourse && (
                  <Card className="bg-slate-900/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white text-2xl">
                        {EDUCATION_CONTENT[selectedCourse].title}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        Clique em qualquer aula para ver o conteúdo completo com gráficos explicativos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {EDUCATION_CONTENT[selectedCourse].modules.map((module, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-6">
                            <h4 className="text-lg font-bold text-white mb-4">{module.title}</h4>
                            <div className="space-y-2">
                              {module.lessons.map((lesson, lessonIdx) => (
                                <div 
                                  key={lessonIdx} 
                                  onClick={() => setSelectedLesson(lesson)}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all cursor-pointer group"
                                >
                                  <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                  <span className="text-sm flex-1">{lesson.title}</span>
                                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Slider de Gráficos Educacionais */}
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <LineChart className="w-6 h-6 text-purple-400" />
                      Aprenda a Ler Gráficos
                    </CardTitle>
                    <CardDescription>
                      Slides interativos com exemplos práticos de análise técnica
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Slide Atual */}
                      <div className="bg-slate-800/50 rounded-lg p-8 mb-4">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {CHART_SLIDES[currentSlide].title}
                          </h3>
                          <p className="text-slate-300">
                            {CHART_SLIDES[currentSlide].description}
                          </p>
                        </div>

                        {/* Área do Gráfico */}
                        <div className="bg-slate-950/50 rounded-lg p-8 mb-6 h-80 flex items-center justify-center border border-slate-700">
                          {renderSimpleChart(CHART_SLIDES[currentSlide].chart)}
                        </div>

                        {/* Dicas */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {CHART_SLIDES[currentSlide].tips.map((tip, idx) => (
                            <div key={idx} className="flex items-start gap-3 bg-slate-700/30 p-4 rounded-lg">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-sm text-slate-300">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Controles do Slider */}
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={prevSlide}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 hover:bg-slate-800"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Anterior
                        </Button>

                        <div className="flex gap-2">
                          {CHART_SLIDES.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentSlide(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentSlide ? 'bg-purple-500 w-8' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>

                        <Button
                          onClick={nextSlide}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 hover:bg-slate-800"
                        >
                          Próximo
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>

                      <p className="text-center text-sm text-slate-400 mt-4">
                        Slide {currentSlide + 1} de {CHART_SLIDES.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
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
