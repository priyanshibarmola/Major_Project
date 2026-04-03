import { Sprout, Home, FlaskConical, TrendingUp, Info, Sun, Moon, CloudOff } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
  { id: 'analyze', label: 'Analyze', icon: FlaskConical },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp },
  { id: 'about', label: 'About', icon: Info },
]

export default function Navbar({ currentPage, onNavigate, mobile }) {
  const { dark, toggle } = useTheme()
  const isOnline = useOnlineStatus()

  if (mobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-earth-200/50 dark:border-earth-700/50 safe-area-pb">
        <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto gap-1">
          {!isOnline && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 shadow-sm">
              <CloudOff className="w-3 h-3" /> Offline
            </span>
          )}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl min-w-[64px] transition-all duration-200
                ${currentPage === item.id
                  ? 'text-sage-600 dark:text-sage-400'
                  : 'text-earth-500 dark:text-earth-500 hover:text-earth-700 dark:hover:text-earth-300'}
              `}
            >
              {currentPage === item.id && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-sage-500" />
              )}
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 glass border-b border-earth-200/50 dark:border-earth-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
          {!isOnline && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 mr-2">
              <CloudOff className="w-3.5 h-3.5" /> Offline
            </span>
          )}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center shadow-lg shadow-sage-500/25 group-hover:shadow-sage-500/40 transition-shadow">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-earth-800 dark:text-earth-100 tracking-tight text-lg">AgriSmart</span>
        </button>

        <nav className="flex items-center gap-0.5 bg-earth-100/60 dark:bg-earth-800/40 rounded-2xl p-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 hidden sm:flex
                ${currentPage === item.id
                  ? 'bg-white dark:bg-earth-700 text-sage-700 dark:text-sage-300 shadow-md'
                  : 'text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'}
              `}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={toggle}
          className="p-2.5 rounded-xl hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-earth-500" />}
        </button>
      </div>
    </header>
  )
}
