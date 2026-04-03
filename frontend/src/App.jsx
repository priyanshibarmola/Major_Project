import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Predictions from './pages/Predictions'
import About from './pages/About'
import { ThemeProvider } from './context/ThemeContext'

const PAGES = { home: Home, dashboard: Dashboard, analyze: Analyze, predictions: Predictions, about: About }
const TITLES = { home: 'AgriSmart', dashboard: 'Dashboard · AgriSmart', analyze: 'Analyze · AgriSmart', predictions: 'Predictions · AgriSmart', about: 'About · AgriSmart' }

export default function App() {
  const [page, setPage] = useState('home')
  const [mobile, setMobile] = useState(false)
  const [transitionKey, setTransitionKey] = useState(0)
  const mainRef = useRef(null)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.title = TITLES[page] || 'AgriSmart'
  }, [page])

  const navigate = (p) => {
    if (p === page) return
    setPage(p)
    setTransitionKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const Page = PAGES[page] || Home

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar currentPage={page} onNavigate={navigate} mobile={false} />
        <main ref={mainRef} className={mobile ? 'pb-24 pt-4' : 'py-4'}>
          <div key={transitionKey} className="page-enter">
            <Page onNavigate={navigate} />
          </div>
        </main>
        {mobile && <Navbar currentPage={page} onNavigate={navigate} mobile />}
        <ChatBot />
      </div>
    </ThemeProvider>
  )
}
