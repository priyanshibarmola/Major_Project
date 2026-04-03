import { useState, useEffect, useRef } from 'react'
import { Leaf, Droplets, Thermometer, CloudOff, Sprout, TrendingUp, FlaskConical, Sparkles, CheckCircle2 } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import FormInput from '../components/FormInput'
import LoadingSpinner from '../components/LoadingSpinner'
import { useOfflineResults } from '../hooks/useOfflineResults'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

const initialForm = {
  district: '',
  N: 50, P: 50, K: 50,
  Zn: 10, Fe: 30, Mn: 20, B: 2, S: 20,
  ph: 6.5, temperature: 25, humidity: 70, rainfall: 100,
}

const LOADING_STEPS = [
  { label: 'Analyzing soil composition...', icon: FlaskConical },
  { label: 'Running ML crop model...', icon: Sprout },
  { label: 'Predicting yield...', icon: TrendingUp },
  { label: 'Generating recommendations...', icon: Sparkles },
]

export default function Analyze() {
  const { isOnline, cached, cachedAt, persist } = useOfflineResults()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [shakeError, setShakeError] = useState(false)
  const resultRef = useRef(null)

  const displayResult = result ?? (isOnline ? null : cached)
  const isCached = !result && cached && !isOnline

  useEffect(() => {
    if (!loading) return
    setLoadingStep(0)
    const timers = LOADING_STEPS.map((_, i) =>
      setTimeout(() => setLoadingStep(i), i * 1200)
    )
    return () => timers.forEach(clearTimeout)
  }, [loading])

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [result])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const base = API_URL.replace(/\/$/, '')
      const res = await fetch(`${base}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          N: Number(form.N), P: Number(form.P), K: Number(form.K),
          Zn: Number(form.Zn), Fe: Number(form.Fe), Mn: Number(form.Mn),
          B: Number(form.B), S: Number(form.S),
          ph: Number(form.ph), temperature: Number(form.temperature),
          humidity: Number(form.humidity), rainfall: Number(form.rainfall),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err.detail)
          ? err.detail.map((d) => d.msg || JSON.stringify(d)).join(', ')
          : err.detail || `HTTP ${res.status}`
        throw new Error(msg)
      }
      const data = await res.json()
      setResult(data)
      persist(data, form)
    } catch (err) {
      if (!isOnline) setError(cached ? 'You\'re offline. Showing last saved results below.' : 'You\'re offline. Connect to run a new analysis.')
      else setError(err.message || 'Analysis failed')
      setShakeError(true)
      setTimeout(() => setShakeError(false), 500)
    } finally {
      setLoading(false)
    }
  }

  const soilColor = (s) => ({ Excellent: 'text-emerald-600 dark:text-emerald-400', Good: 'text-sage-600 dark:text-sage-400', Moderate: 'text-amber-600 dark:text-amber-400', Poor: 'text-red-600 dark:text-red-400' }[s] || 'text-earth-500')
  const soilBorder = (s) => ({ Excellent: 'border-l-emerald-500', Good: 'border-l-sage-500', Moderate: 'border-l-amber-500', Poor: 'border-l-red-500' }[s] || 'border-l-earth-400')

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="stagger-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-sage-600 flex items-center justify-center text-white shadow-lg shadow-sage-500/25">
            <FlaskConical className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold text-earth-800 dark:text-earth-50 tracking-tight">Soil Analysis</h1>
        </div>
        <p className="text-earth-500 dark:text-earth-400 mb-8 ml-[52px]">Enter soil data to get crop recommendations and insights</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 stagger-in">
        <Card className="p-6">
          <h2 className="font-bold text-earth-800 dark:text-earth-100 mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-sage-600" /> Location
          </h2>
          <FormInput label="District" value={form.district} onChange={(v) => handleChange('district', v)} placeholder="e.g. Dehradun" required />
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-earth-800 dark:text-earth-100 mb-4 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-500" /> Macronutrients (kg/ha)
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {['N', 'P', 'K'].map((f) => (
              <FormInput key={f} label={f} type="number" step="0.1" value={form[f]} onChange={(v) => handleChange(f, v)} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-earth-800 dark:text-earth-100 mb-4">Micronutrients (ppm)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {['Zn', 'Fe', 'Mn', 'B', 'S'].map((f) => (
              <FormInput key={f} label={f} type="number" step="0.1" value={form[f]} onChange={(v) => handleChange(f, v)} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-earth-800 dark:text-earth-100 mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-amber-500" /> Environment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormInput label="pH" type="number" step="0.1" min="0" max="14" value={form.ph} onChange={(v) => handleChange('ph', v)} />
            <FormInput label="Temp (°C)" type="number" step="0.1" value={form.temperature} onChange={(v) => handleChange('temperature', v)} />
            <FormInput label="Humidity (%)" type="number" step="0.1" min="0" max="100" value={form.humidity} onChange={(v) => handleChange('humidity', v)} />
            <FormInput label="Rainfall (mm)" type="number" step="0.1" value={form.rainfall} onChange={(v) => handleChange('rainfall', v)} />
          </div>
        </Card>

        {error && (
          <div className={`rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-red-700 dark:text-red-300 text-sm ${shakeError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <LoadingSpinner size="sm" />
              {LOADING_STEPS[loadingStep]?.label ?? 'Analyzing...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Analyze Soil & Get Recommendations
            </span>
          )}
        </Button>
      </form>

      {/* Loading progress */}
      {loading && (
        <div className="mt-8 space-y-3">
          {LOADING_STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${i <= loadingStep ? 'bg-sage-50 dark:bg-sage-900/20 opacity-100' : 'opacity-30'}`}>
              {i < loadingStep ? (
                <CheckCircle2 className="w-5 h-5 text-sage-600 dark:text-sage-400 shrink-0" />
              ) : i === loadingStep ? (
                <LoadingSpinner size="sm" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-earth-300 dark:border-earth-600 shrink-0" />
              )}
              <span className={`text-sm font-medium ${i <= loadingStep ? 'text-earth-800 dark:text-earth-100' : 'text-earth-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {displayResult && (
        <div ref={resultRef} className="mt-12 space-y-6 stagger-in">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-extrabold text-earth-800 dark:text-earth-100 tracking-tight">Results</h2>
            {isCached && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                <CloudOff className="w-4 h-4" /> Offline cache
              </span>
            )}
          </div>

          {/* Best crop hero */}
          <Card className="p-6 border-l-4 border-l-sage-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl" />
            <h3 className="text-sm font-semibold text-earth-500 dark:text-earth-400 mb-1 uppercase tracking-wider">Recommended Crop</h3>
            <p className="text-3xl font-extrabold text-sage-600 dark:text-sage-400 capitalize tracking-tight">{displayResult.cropRecommendation.bestCrop}</p>
            <p className="text-earth-500 dark:text-earth-400 text-sm mt-1">Confidence: <strong>{displayResult.cropRecommendation.confidence}%</strong></p>
            <div className="flex flex-wrap gap-2 mt-4">
              {displayResult.cropRecommendation.top3Crops.map((c, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 text-sm font-medium capitalize border border-sage-200 dark:border-sage-800">
                  {c.crop} <span className="text-sage-500">({c.confidence}%)</span>
                </span>
              ))}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6 border-l-4 border-l-sky-500">
              <h3 className="text-sm font-semibold text-earth-500 dark:text-earth-400 mb-1 uppercase tracking-wider">Expected Yield</h3>
              <p className="text-3xl font-extrabold text-earth-800 dark:text-earth-100">{displayResult.yieldPrediction.estimatedYield} <span className="text-base font-normal text-earth-500">t/ha</span></p>
            </Card>
            <Card className={`p-6 border-l-4 ${soilBorder(displayResult.soilHealth.status)}`}>
              <h3 className="text-sm font-semibold text-earth-500 dark:text-earth-400 mb-1 uppercase tracking-wider">Soil Health</h3>
              <p className={`text-3xl font-extrabold ${soilColor(displayResult.soilHealth.status)}`}>{displayResult.soilHealth.score}</p>
              <p className={`text-sm font-semibold mt-1 ${soilColor(displayResult.soilHealth.status)}`}>{displayResult.soilHealth.status}</p>
            </Card>
          </div>

          <Card className="p-6 border-l-4 border-l-amber-500">
            <h3 className="text-sm font-semibold text-earth-500 dark:text-earth-400 mb-4 uppercase tracking-wider">Fertilizer Suggestions</h3>
            <ul className="space-y-3">
              {displayResult.fertilizerRecommendation.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-earth-700 dark:text-earth-300 text-sm">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{i + 1}</span>
                  </span>
                  <span>
                    {rec.nutrient && (
                      <><strong className="text-earth-800 dark:text-earth-100">{rec.nutrient}</strong>{rec.deficiency != null && <span className="text-earth-500"> (deficit: {rec.deficiency})</span>}: {rec.fertilizer} — {rec.suggested_dose}</>
                    )}
                    {rec.message && <span>{rec.message}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
