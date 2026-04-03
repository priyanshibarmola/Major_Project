import { useState, useEffect, useRef } from 'react'
import { Sprout, Leaf, TrendingUp, BarChart3, FlaskConical, ChevronDown, ChevronUp, Calendar, ArrowRight } from 'lucide-react'
import Card, { CardHeader } from '../components/Card'
import EmptyState from '../components/EmptyState'
import { useAnalysisHistory } from '../hooks/useAnalysisHistory'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatEntryLabel(savedAt) {
  const d = new Date(savedAt)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

function formatFullDate(savedAt) {
  const d = new Date(savedAt)
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function AnimatedNumber({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const target = Number(value) || 0
    if (target === 0) { setDisplay(0); return }
    let start = 0
    const duration = 800
    const t0 = performance.now()
    const step = (now) => {
      const elapsed = now - t0
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (target - start) * eased)
      if (progress < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [value])

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}{suffix}</>
}

export default function Dashboard({ onNavigate }) {
  const { history } = useAnalysisHistory()
  const [showHistory, setShowHistory] = useState(false)

  const latest = history.length > 0 ? history[history.length - 1] : null
  const latestResult = latest?.result

  const yieldTrend = history
    .slice(-12)
    .map((e) => ({
      label: formatEntryLabel(e.savedAt),
      value: e.result?.yieldPrediction?.estimatedYield ?? 0,
    }))

  const fallback = {
    crop: { name: '—', confidence: 0 },
    soil: { score: 0, status: '—' },
    yield: { value: 0, unit: 't/ha' },
  }

  const crop = latestResult?.cropRecommendation ? { name: latestResult.cropRecommendation.bestCrop, confidence: latestResult.cropRecommendation.confidence } : fallback.crop
  const soil = latestResult?.soilHealth ?? fallback.soil
  const yieldVal = latestResult?.yieldPrediction ? { value: latestResult.yieldPrediction.estimatedYield, unit: 't/ha' } : fallback.yield

  const soilColor = ({ Excellent: 'text-emerald-600 dark:text-emerald-400', Good: 'text-sage-600 dark:text-sage-400', Moderate: 'text-amber-600 dark:text-amber-400', Poor: 'text-red-600 dark:text-red-400' }[soil.status] || 'text-earth-500')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="stagger-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold text-earth-800 dark:text-earth-50 tracking-tight">Dashboard</h1>
        </div>
        <p className="text-earth-500 dark:text-earth-400 mb-8 ml-[52px]">Overview of your agriculture analytics</p>
      </div>

      {history.length === 0 && (
        <Card className="mb-8 p-8">
          <EmptyState
            icon={FlaskConical}
            title="No analyses yet"
            description="Run a soil analysis to see your crop recommendations, yield forecast, and historical trends here."
          />
          {onNavigate && (
            <button
              onClick={() => onNavigate('analyze')}
              className="mt-4 mx-auto flex items-center gap-2 px-6 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold transition-colors shadow-lg shadow-sage-600/30"
            >
              Run Analysis <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 stagger-in">
        <Card hover className="p-6 border-l-4 border-l-sage-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center text-sage-600 dark:text-sage-400">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-earth-800 dark:text-earth-100">Crop</h3>
          </div>
          <p className="text-2xl font-extrabold text-earth-800 dark:text-earth-100 capitalize tracking-tight">{crop.name}</p>
          <p className="text-sm text-sage-600 dark:text-sage-400 font-medium"><AnimatedNumber value={crop.confidence} suffix="%" /> match</p>
        </Card>

        <Card hover className="p-6 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-earth-800 dark:text-earth-100">Soil Health</h3>
          </div>
          <p className="text-2xl font-extrabold text-earth-800 dark:text-earth-100"><AnimatedNumber value={soil.score} /></p>
          <p className={`text-sm font-semibold ${soilColor}`}>{soil.status}</p>
        </Card>

        <Card hover className="p-6 border-l-4 border-l-sky-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-earth-800 dark:text-earth-100">Yield</h3>
          </div>
          <p className="text-2xl font-extrabold text-earth-800 dark:text-earth-100"><AnimatedNumber value={yieldVal.value} decimals={2} /></p>
          <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">t/ha</p>
        </Card>

        <button type="button" onClick={() => setShowHistory((v) => !v)} className="text-left">
          <Card hover className="p-6 h-full border-l-4 border-l-earth-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-earth-100 dark:bg-earth-700 flex items-center justify-center text-earth-600 dark:text-earth-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-earth-800 dark:text-earth-100">History</h3>
              <span className="ml-auto">{showHistory ? <ChevronUp className="w-5 h-5 text-earth-500" /> : <ChevronDown className="w-5 h-5 text-earth-500" />}</span>
            </div>
            <p className="text-2xl font-extrabold text-earth-800 dark:text-earth-100"><AnimatedNumber value={history.length} /></p>
            <p className="text-sm text-earth-500 dark:text-earth-400 font-medium">analyses · {showHistory ? 'Hide' : 'Show'}</p>
          </Card>
        </button>
      </div>

      {showHistory && (
        <Card className="mb-10 overflow-hidden">
          <CardHeader icon={Calendar} title="Past Analyses" badge={`${history.length} total`} />
          <div className="p-6 pt-4">
            {history.length === 0 ? (
              <EmptyState icon={BarChart3} title="No past analyses" description="Run a soil analysis to build your history." />
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {[...history].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-earth-50 dark:bg-earth-800/50 border border-earth-200 dark:border-earth-700 hover:border-sage-300 dark:hover:border-sage-700 transition-colors"
                  >
                    <span className="text-sm font-semibold text-earth-600 dark:text-earth-400 whitespace-nowrap">
                      {formatFullDate(entry.savedAt)}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-sage-100 dark:bg-sage-900/50 text-sage-700 dark:text-sage-300 text-sm font-semibold capitalize">
                      {entry.result?.cropRecommendation?.bestCrop ?? '—'}
                    </span>
                    <span className="text-earth-500 dark:text-earth-400 text-sm">
                      Yield: <strong className="text-earth-700 dark:text-earth-200">{entry.result?.yieldPrediction?.estimatedYield ?? '—'} t/ha</strong>
                    </span>
                    <span className="text-earth-500 dark:text-earth-400 text-sm">
                      Soil: <strong className="text-earth-700 dark:text-earth-200">{entry.result?.soilHealth?.score ?? '—'}</strong> ({entry.result?.soilHealth?.status ?? '—'})
                    </span>
                    {entry.formInput?.district && (
                      <span className="text-earth-500 dark:text-earth-400 text-sm ml-auto">{entry.formInput.district}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <CardHeader icon={BarChart3} title="Yield Trend" badge={yieldTrend.length > 0 ? `${yieldTrend.length} points` : null} />
        <div className="p-6 pt-4">
          {yieldTrend.length > 0 ? (
            <div className="flex items-end gap-2 h-44 overflow-x-auto pb-2">
              {yieldTrend.map((d, i) => {
                const maxVal = Math.max(...yieldTrend.map((x) => x.value || 0), 0.1)
                return (
                  <div key={i} className="flex-1 min-w-[48px] flex flex-col items-center group" title={`${d.label}: ${d.value} t/ha`}>
                    <span className="text-xs font-bold text-sage-600 dark:text-sage-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">{d.value}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-sage-600 to-sage-400 dark:from-sage-700 dark:to-sage-500 min-h-[8px] transition-all duration-500 hover:from-sage-500 hover:to-sage-300 shadow-sm"
                      style={{ height: `${Math.max(8, ((d.value || 0) / maxVal) * 80)}%` }}
                    />
                    <span className="text-xs text-earth-500 dark:text-earth-400 mt-2 truncate w-full text-center font-medium">{d.label}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState icon={BarChart3} title="No yield data yet" description="Run soil analyses to build your yield trend chart." />
          )}
        </div>
      </Card>
    </div>
  )
}
