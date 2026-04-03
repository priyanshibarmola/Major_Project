import { Sprout, Code2, Brain, Database, Globe, Layers, Heart, ExternalLink } from 'lucide-react'
import Card from '../components/Card'

const TECH_STACK = [
  { icon: Brain, label: 'Scikit-learn', desc: 'ML models for crop & yield', color: 'text-orange-500' },
  { icon: Code2, label: 'FastAPI', desc: 'High-performance Python API', color: 'text-emerald-500' },
  { icon: Layers, label: 'React 19', desc: 'Modern UI with Vite', color: 'text-sky-500' },
  { icon: Database, label: 'Pandas', desc: 'Data processing pipeline', color: 'text-purple-500' },
  { icon: Globe, label: 'Tailwind 4', desc: 'Utility-first CSS framework', color: 'text-cyan-500' },
  { icon: Heart, label: 'Open Source', desc: 'Built as a Major Project', color: 'text-red-500' },
]

const CAPABILITIES = [
  'Crop recommendation using Random Forest / ensemble models',
  'Yield prediction based on soil + weather features',
  'Soil health scoring (pH, macronutrients, micronutrients)',
  'Fertilizer suggestions with deficit-aware dosing',
  'Offline-first: works without internet using cached results',
  'AI chatbot powered by Gemini for farming Q&A',
  'Dark mode with smooth transitions',
  'History tracking with localStorage persistence',
]

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center stagger-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sage-500 to-sage-700 text-white shadow-2xl shadow-sage-500/30 mb-6">
          <Sprout className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-earth-800 dark:text-earth-50 tracking-tight mb-3">
          About AgriSmart
        </h1>
        <p className="text-lg text-earth-500 dark:text-earth-400 max-w-xl mx-auto leading-relaxed">
          An ML-powered agriculture analytics platform that helps farmers make data-driven decisions about crops, soil health, and yield optimization.
        </p>
      </div>

      {/* Mission card */}
      <Card className="p-8 relative overflow-hidden border-l-4 border-l-sage-500">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sage-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <h2 className="text-xl font-extrabold text-earth-800 dark:text-earth-100 mb-3 tracking-tight">Our Mission</h2>
        <p className="text-earth-600 dark:text-earth-300 leading-relaxed">
          Agriculture is the backbone of our economy. Yet many farmers lack access to modern tools for soil analysis and crop planning. AgriSmart bridges this gap by putting machine learning models — trained on real agricultural data — into a simple, beautiful interface that anyone can use. Enter your soil data, and get instant, actionable recommendations.
        </p>
      </Card>

      {/* Tech stack */}
      <div>
        <div className="text-center mb-8">
          <span className="text-sm font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400 mb-2 block">Built With</span>
          <h2 className="text-2xl font-extrabold text-earth-800 dark:text-earth-100 tracking-tight">Technology Stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {TECH_STACK.map((t) => (
            <Card key={t.label} hover className="p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl bg-earth-100 dark:bg-earth-700 flex items-center justify-center shrink-0 ${t.color}`}>
                <t.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-earth-800 dark:text-earth-100 text-sm">{t.label}</h3>
                <p className="text-earth-500 dark:text-earth-400 text-xs mt-0.5">{t.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Capabilities */}
      <Card className="p-8">
        <h2 className="text-xl font-extrabold text-earth-800 dark:text-earth-100 mb-6 tracking-tight">What AgriSmart Can Do</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {CAPABILITIES.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-earth-50 dark:hover:bg-earth-800/50 transition-colors">
              <span className="w-6 h-6 rounded-lg bg-sage-100 dark:bg-sage-900/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-sage-700 dark:text-sage-300">{i + 1}</span>
              </span>
              <span className="text-sm text-earth-700 dark:text-earth-300 leading-relaxed">{c}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* API docs link */}
      <Card className="p-6 flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-earth-50 to-sage-50 dark:from-earth-800/50 dark:to-sage-900/20 border-earth-200 dark:border-earth-700">
        <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center text-sage-600 shrink-0">
          <Code2 className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-earth-800 dark:text-earth-100">API Documentation</h3>
          <p className="text-sm text-earth-500 dark:text-earth-400">Explore the FastAPI Swagger docs for integration</p>
        </div>
        <a
          href="/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition-colors glow-sage"
        >
          Open Docs <ExternalLink className="w-4 h-4" />
        </a>
      </Card>

      {/* Footer note */}
      <p className="text-center text-sm text-earth-400 dark:text-earth-500">
        Major Project · Built with FastAPI + React + Scikit-learn
      </p>
    </div>
  )
}
