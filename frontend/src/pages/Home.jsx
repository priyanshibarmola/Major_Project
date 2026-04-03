import { Sprout, Leaf, TrendingUp, Zap, Shield, BarChart3, ArrowRight, Star } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'

const STATS = [
  { value: '22+', label: 'Crop Types', icon: Sprout },
  { value: '95%', label: 'Accuracy', icon: Zap },
  { value: '10K+', label: 'Analyses', icon: BarChart3 },
  { value: '100%', label: 'Free', icon: Shield },
]

const FEATURES = [
  {
    icon: Leaf,
    title: 'Soil Analysis',
    desc: 'Input soil nutrients, pH, and climate data. Get instant health scores with actionable insights.',
    color: 'from-emerald-500 to-sage-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    nav: 'analyze',
  },
  {
    icon: Sprout,
    title: 'Crop Recommendation',
    desc: 'ML models trained on thousands of data points suggest the best crops for your unique conditions.',
    color: 'from-sage-500 to-sage-700',
    bg: 'bg-sage-50 dark:bg-sage-900/20',
    nav: 'predictions',
  },
  {
    icon: TrendingUp,
    title: 'Yield Forecast',
    desc: 'Track yield predictions over time. Compare analyses and plan your seasons with confidence.',
    color: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    nav: 'dashboard',
  },
]

const STEPS = [
  { num: '01', title: 'Enter Soil Data', desc: 'Fill in N, P, K, pH, temperature, humidity, and rainfall for your field.' },
  { num: '02', title: 'AI Analyzes', desc: 'Our ML models process your data against thousands of real-world crop records.' },
  { num: '03', title: 'Get Results', desc: 'Receive crop recommendations, yield forecasts, soil scores, and fertilizer plans.' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center grain">
        <div className="absolute inset-0 mesh-gradient" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-sage-300/20 dark:bg-sage-600/10 blur-3xl animate-float" />
          <div className="absolute bottom-32 right-[15%] w-96 h-96 rounded-full bg-sky-200/15 dark:bg-sky-700/10 blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-amber-200/10 dark:bg-amber-700/5 blur-3xl animate-float-slow" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center py-24 stagger-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sage-700 dark:text-sage-300 text-sm font-semibold mb-8 shadow-lg">
            <Sprout className="w-4 h-4" />
            ML-Powered Agriculture Analytics
            <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-earth-800 dark:text-earth-50 mb-6 leading-[1.1] tracking-tight">
            Grow smarter with
            <br />
            <span className="bg-gradient-to-r from-sage-600 via-sage-500 to-emerald-500 bg-clip-text text-transparent">
              AgriSmart
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-earth-500 dark:text-earth-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Soil analysis, crop recommendations, and yield forecasts — powered by machine learning, built for farmers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" onClick={() => onNavigate('analyze')}>
              <FlaskIcon className="w-5 h-5" /> Analyze Soil
            </Button>
            <Button variant="secondary" size="lg" onClick={() => onNavigate('predictions')}>
              <Sprout className="w-5 h-5" /> Crop Prediction
            </Button>
            <Button variant="outline" size="lg" onClick={() => onNavigate('dashboard')}>
              <TrendingUp className="w-5 h-5" /> View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section className="relative -mt-16 z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Card glass className="p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-earth-200/50 dark:divide-earth-700/50">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-5 px-4">
                  <s.icon className="w-5 h-5 text-sage-500 mb-2" />
                  <span className="text-2xl md:text-3xl font-extrabold text-earth-800 dark:text-earth-100 tracking-tight">{s.value}</span>
                  <span className="text-xs text-earth-500 dark:text-earth-400 font-medium mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 stagger-in">
            <span className="text-sm font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400 mb-3 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-earth-800 dark:text-earth-100 tracking-tight">
              Everything you need for
              <span className="text-sage-600 dark:text-sage-400"> smarter farming</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 stagger-in">
            {FEATURES.map((f) => (
              <button
                key={f.title}
                onClick={() => onNavigate(f.nav)}
                className="group text-left"
              >
                <Card hover className="p-8 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.06] dark:opacity-[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-xl group-hover:opacity-[0.12] transition-opacity" style={{ background: `linear-gradient(135deg, var(--color-sage-400), var(--color-sage-600))` }} />
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-earth-800 dark:text-earth-100 text-lg mb-3">{f.title}</h3>
                  <p className="text-earth-500 dark:text-earth-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sage-600 dark:text-sage-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    Try it <ArrowRight className="w-4 h-4" />
                  </span>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-earth-100/50 dark:bg-earth-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest text-sage-600 dark:text-sage-400 mb-3 block">How it works</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-earth-800 dark:text-earth-100 tracking-tight">
              Three simple steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 stagger-in">
            {STEPS.map((s) => (
              <div key={s.num} className="relative">
                <span className="text-6xl font-black text-sage-500/10 dark:text-sage-400/10 absolute -top-4 -left-2">{s.num}</span>
                <div className="relative pt-8 pl-2">
                  <h3 className="font-bold text-earth-800 dark:text-earth-100 text-lg mb-2">{s.title}</h3>
                  <p className="text-earth-500 dark:text-earth-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Button size="lg" onClick={() => onNavigate('analyze')}>
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial / CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-earth-800 dark:text-earth-100 leading-snug mb-6 tracking-tight">
            "AgriSmart helped me choose the right crop for my field. My yield increased by 30% in one season."
          </blockquote>
          <p className="text-earth-500 dark:text-earth-400 font-medium">— A happy farmer</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-earth-200 dark:border-earth-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-earth-500 dark:text-earth-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sage-500 flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-earth-700 dark:text-earth-300">AgriSmart</span>
          </div>
          <p>Built with FastAPI + React + ML · Major Project</p>
        </div>
      </footer>
    </div>
  )
}

function FlaskIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" /><path d="M7 16h10" />
    </svg>
  )
}
