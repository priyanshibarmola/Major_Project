import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import {
  Sprout, TrendingUp, Trophy, ArrowRight, Sparkles, Wheat,
  Droplets, ThermometerSun, FlaskConical, RefreshCw,
} from 'lucide-react'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import { useAnalysisHistory } from '../hooks/useAnalysisHistory'

const BAR_COLORS = ['#2d6b20', '#3d8b30', '#5a9a40', '#7ab855', '#9dcc78']
const MEDAL_STYLES = [
  'from-yellow-400 to-amber-500 text-amber-900 shadow-amber-300/40',
  'from-gray-300 to-gray-400 text-gray-700 shadow-gray-300/30',
  'from-amber-600 to-amber-700 text-amber-100 shadow-amber-600/30',
]

function getMedalIcon(i) {
  if (i === 0) return <Trophy className="w-5 h-5" />
  return <span className="text-sm font-bold">{i + 1}</span>
}

export default function Predictions({ onNavigate }) {
  const { history, refresh } = useAnalysisHistory()
  const [tab, setTab] = useState('crop')
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(false)
    const t = requestAnimationFrame(() => setAnimateIn(true))
    return () => cancelAnimationFrame(t)
  }, [tab])

  const latest = history.length > 0 ? history[history.length - 1] : null
  const latestResult = latest?.result

  const cropData = (() => {
    if (!latestResult?.cropRecommendation) return []
    const { bestCrop, confidence, top3Crops } = latestResult.cropRecommendation
    const map = new Map()
    if (bestCrop) map.set(bestCrop.toLowerCase(), { crop: bestCrop, confidence })
    if (top3Crops) {
      for (const c of top3Crops) {
        const key = c.crop.toLowerCase()
        if (!map.has(key)) map.set(key, { crop: c.crop, confidence: c.confidence })
      }
    }
    return [...map.values()].sort((a, b) => b.confidence - a.confidence)
  })()

  const yieldTrend = history
    .slice(-12)
    .map((e) => {
      const d = new Date(e.savedAt)
      return {
        label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        yield: e.result?.yieldPrediction?.estimatedYield ?? 0,
        crop: e.result?.cropRecommendation?.bestCrop ?? '',
        district: e.formInput?.district ?? '',
      }
    })

  const currentYield = latestResult?.yieldPrediction?.estimatedYield ?? 0
  const soilHealth = latestResult?.soilHealth
  const district = latest?.formInput?.district

  const maxConf = cropData.length > 0 ? Math.max(...cropData.map((c) => c.confidence)) : 100

  const isEmpty = history.length === 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-lg shadow-sage-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-earth-800 dark:text-earth-50 tracking-tight">
              Predictions
            </h1>
          </div>
          <p className="text-earth-500 dark:text-earth-400 ml-[52px]">
            {isEmpty
              ? 'Run a soil analysis to see live crop and yield predictions'
              : `Based on ${history.length} analysis${history.length > 1 ? 'es' : ''}${district ? ` · latest from ${district}` : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-[52px] sm:ml-0">
          <button
            onClick={refresh}
            title="Refresh data"
            className="p-2.5 rounded-xl bg-earth-100 dark:bg-earth-800 hover:bg-earth-200 dark:hover:bg-earth-700 text-earth-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-earth-100 dark:bg-earth-800/80 w-fit gap-1">
        {[
          { id: 'crop', label: 'Crop Recommendation', icon: Sprout },
          { id: 'yield', label: 'Yield Prediction', icon: TrendingUp },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
              ${tab === t.id
                ? 'bg-white dark:bg-earth-700 text-sage-700 dark:text-sage-300 shadow-md'
                : 'text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
              }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`transition-all duration-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* ============ CROP TAB ============ */}
        {tab === 'crop' && (
          isEmpty ? (
            <Card className="p-10">
              <EmptyState
                icon={FlaskConical}
                title="No predictions yet"
                description="Head over to Analyze and run a soil analysis. Your crop recommendations will appear here dynamically."
              />
              {onNavigate && (
                <button
                  onClick={() => onNavigate('analyze')}
                  className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold transition-colors shadow-lg shadow-sage-600/30"
                >
                  Run Analysis <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Hero: best crop */}
              {cropData.length > 0 && (
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-sage-600 via-sage-700 to-sage-800 text-white p-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-2 ring-white/20">
                      <Wheat className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sage-200 text-sm font-medium mb-1 uppercase tracking-wider">Top Recommendation</p>
                      <h2 className="text-4xl font-extrabold capitalize tracking-tight">{cropData[0].crop}</h2>
                      <p className="text-sage-200 mt-1">
                        {cropData[0].confidence}% model confidence
                        {soilHealth && <span> · Soil: {soilHealth.status} ({soilHealth.score})</span>}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-5xl font-black">{cropData[0].confidence}%</div>
                      <div className="text-sage-200 text-sm">confidence</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Crop ranking */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-earth-800 dark:text-earth-100">
                    Crop Compatibility Ranking
                  </h3>
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300">
                    {cropData.length} crop{cropData.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-4">
                  {cropData.map((row, i) => {
                    const pct = maxConf > 0 ? (row.confidence / maxConf) * 100 : 0
                    return (
                      <div
                        key={row.crop}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-earth-50 dark:hover:bg-earth-800/60 transition-colors"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {/* Medal */}
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-md
                          ${i < 3 ? MEDAL_STYLES[i] : 'from-earth-200 to-earth-300 dark:from-earth-700 dark:to-earth-600 text-earth-500 dark:text-earth-400 shadow-none'}`}
                        >
                          {getMedalIcon(i)}
                        </div>
                        {/* Name */}
                        <span className="w-28 font-semibold text-earth-800 dark:text-earth-100 capitalize truncate">
                          {row.crop}
                        </span>
                        {/* Bar */}
                        <div className="flex-1 relative">
                          <div className="h-4 rounded-full bg-earth-100 dark:bg-earth-700/60 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: animateIn ? `${pct}%` : '0%',
                                background: `linear-gradient(90deg, ${BAR_COLORS[i % BAR_COLORS.length]}, ${BAR_COLORS[i % BAR_COLORS.length]}dd)`,
                                transitionDelay: `${i * 100}ms`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Percentage */}
                        <span className="w-16 text-right font-bold text-sage-600 dark:text-sage-400 text-lg">
                          {row.confidence}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Quick stats row */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="p-5 flex items-center gap-4" hover>
                  <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center text-sage-600 dark:text-sage-400">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Best Crop</p>
                    <p className="text-lg font-bold text-earth-800 dark:text-earth-100 capitalize">{cropData[0]?.crop ?? '—'}</p>
                  </div>
                </Card>
                <Card className="p-5 flex items-center gap-4" hover>
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Expected Yield</p>
                    <p className="text-lg font-bold text-earth-800 dark:text-earth-100">{currentYield} <span className="text-sm font-normal text-earth-500">t/ha</span></p>
                  </div>
                </Card>
                <Card className="p-5 flex items-center gap-4" hover>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-earth-500 dark:text-earth-400 font-medium">Soil Health</p>
                    <p className="text-lg font-bold text-earth-800 dark:text-earth-100">{soilHealth?.status ?? '—'} <span className="text-sm font-normal text-earth-500">{soilHealth?.score ?? ''}</span></p>
                  </div>
                </Card>
              </div>
            </div>
          )
        )}

        {/* ============ YIELD TAB ============ */}
        {tab === 'yield' && (
          isEmpty ? (
            <Card className="p-10">
              <EmptyState
                icon={FlaskConical}
                title="No yield data yet"
                description="Run soil analyses to build your yield prediction trend over time."
              />
              {onNavigate && (
                <button
                  onClick={() => onNavigate('analyze')}
                  className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold transition-colors shadow-lg shadow-sage-600/30"
                >
                  Run Analysis <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Current yield hero */}
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 text-white p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 ring-2 ring-white/20">
                    <ThermometerSun className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sky-200 text-sm font-medium mb-1 uppercase tracking-wider">Latest Yield Estimate</p>
                    <h2 className="text-4xl font-extrabold tracking-tight">{currentYield} t/ha</h2>
                    <p className="text-sky-200 mt-1">
                      {cropData[0]?.crop ? `For ${cropData[0].crop}` : ''}
                      {district ? ` in ${district}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-5xl font-black">{yieldTrend.length}</div>
                    <div className="text-sky-200 text-sm">data point{yieldTrend.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </Card>

              {/* Area chart: yield over time */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-earth-800 dark:text-earth-100 mb-6">Yield Trend Over Time</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={yieldTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="yieldGradDynamic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0284c7" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200 dark:stroke-earth-700" />
                      <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-earth-500" />
                      <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} className="text-earth-500" unit=" t/ha" width={60} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid var(--color-earth-200, #d4d4d4)', background: 'var(--color-earth-50, #fafaf9)' }}
                        formatter={(v, _name, props) => {
                          const p = props.payload
                          return [`${v} t/ha${p.crop ? ` (${p.crop})` : ''}${p.district ? ` · ${p.district}` : ''}`, 'Yield']
                        }}
                        labelFormatter={(l) => l}
                      />
                      <Area type="monotone" dataKey="yield" stroke="#0284c7" strokeWidth={2.5} fill="url(#yieldGradDynamic)" dot={{ r: 4, fill: '#0284c7' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar chart: yield per analysis */}
              {yieldTrend.length > 1 && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-earth-800 dark:text-earth-100 mb-6">Yield Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={yieldTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-earth-200 dark:stroke-earth-700" />
                        <XAxis dataKey="label" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-earth-500" />
                        <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} className="text-earth-500" unit=" t/ha" width={60} />
                        <Tooltip
                          contentStyle={{ borderRadius: 12, border: '1px solid var(--color-earth-200, #d4d4d4)', background: 'var(--color-earth-50, #fafaf9)' }}
                          formatter={(v, _name, props) => {
                            const p = props.payload
                            return [`${v} t/ha${p.crop ? ` (${p.crop})` : ''}`, 'Yield']
                          }}
                        />
                        <Bar dataKey="yield" radius={[6, 6, 0, 0]} maxBarSize={48}>
                          {yieldTrend.map((_, i) => (
                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
