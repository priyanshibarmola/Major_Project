import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Predictions from './pages/Predictions'
import About from './pages/About'
import { ThemeProvider } from './context/ThemeContext'

const PAGES = { home: Home, dashboard: Dashboard, analyze: Analyze, predictions: Predictions, about: About }

export default function App() {
  const [page, setPage] = useState('home')
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const Page = PAGES[page] || Home

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navbar currentPage={page} onNavigate={setPage} mobile={false} />
        <main className={mobile ? 'pb-24 pt-4' : 'py-4'}>
          <Page onNavigate={setPage} />
        </main>
        {mobile && <Navbar currentPage={page} onNavigate={setPage} mobile />}
        <ChatBot />
      </div>
    </ThemeProvider>
  )
}
