import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sprout, Bot, User } from 'lucide-react'

// Gemini API config
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash'

const SYSTEM_PROMPT = `You are AgriSmart Assistant, an AI-powered agriculture expert chatbot. You help farmers and agricultural enthusiasts with:
- Crop recommendations based on soil and weather conditions
- Soil health tips and fertilizer suggestions
- Yield optimization strategies
- General farming best practices
- Interpreting soil analysis results

Keep responses concise, friendly, and actionable. If you don't know something, say so honestly.`

const WELCOME_MSG = {
  role: 'assistant',
  content: "Hi! I'm your AgriSmart assistant. Ask me anything about crops, soil health, fertilizers, or farming practices. How can I help you today?",
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    if (!API_KEY) {
      setMessages([...updated, {
        role: 'assistant',
        content: getFallbackResponse(text),
      }])
      setLoading(false)
      return
    }

    try {
      const chatHistory = updated
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)

      // Build Gemini contents format
      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I am AgriSmart Assistant, ready to help with agriculture questions.' }] },
        ...chatHistory.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      ]

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error?.message || `API error: ${res.status}`)
      }

      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([...updated, {
        role: 'assistant',
        content: `I'm having trouble connecting right now. Please try again later. (${err.message})`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          fixed z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          transition-all duration-200 active:scale-95
          ${open
            ? 'bg-earth-600 hover:bg-earth-700 bottom-6 right-6'
            : 'bg-sage-600 hover:bg-sage-700 bottom-6 right-6 md:bottom-8 md:right-8'}
        `}
        style={{ bottom: 'env(safe-area-inset-bottom, 24px)' }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed z-40 bottom-24 right-4 md:right-8 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-sage-600 dark:bg-sage-800 text-white shrink-0">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AgriSmart Assistant</h3>
              <p className="text-sage-200 text-xs">Agriculture AI helper</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-sage-100 dark:bg-sage-900/50' : 'bg-earth-100 dark:bg-earth-800'}`}>
                  {msg.role === 'user'
                    ? <User className="w-4 h-4 text-sage-700 dark:text-sage-300" />
                    : <Bot className="w-4 h-4 text-earth-600 dark:text-earth-300" />}
                </div>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sage-600 text-white rounded-tr-md'
                    : 'bg-earth-100 dark:bg-earth-800 text-earth-800 dark:text-earth-100 rounded-tl-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-earth-100 dark:bg-earth-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-earth-600 dark:text-earth-300" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-earth-100 dark:bg-earth-800">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="shrink-0 px-4 py-3 border-t border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-900">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crops, soil, farming..."
                rows={1}
                className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 bg-earth-50 dark:bg-earth-800 text-earth-800 dark:text-earth-100 placeholder-earth-400 text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 disabled:hover:bg-sage-600 flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getFallbackResponse(text) {
  const lower = text.toLowerCase()

  if (lower.includes('crop') && (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best'))) {
    return "To get crop recommendations, go to the Analyze page and enter your soil data (N, P, K, pH, etc.). The ML model will suggest the best crop for your conditions. Common recommendations include rice for high-rainfall areas, wheat for moderate climates, and maize for well-drained soils."
  }

  if (lower.includes('soil') && (lower.includes('health') || lower.includes('improve') || lower.includes('quality'))) {
    return "Soil health depends on nutrient levels (N, P, K), micronutrients (Zn, Fe, Mn), pH, and organic matter. To improve soil health:\n\n1. Test your soil regularly\n2. Add organic compost to improve structure\n3. Rotate crops to prevent nutrient depletion\n4. Maintain pH between 6.0-7.5 for most crops\n5. Use the Analyze page to get a health score!"
  }

  if (lower.includes('fertilizer') || lower.includes('nutrient')) {
    return "Fertilizer needs depend on your soil's nutrient levels. Run a soil analysis on the Analyze page to get specific recommendations. General tips:\n\n- Low Nitrogen: Apply Urea (40-60 kg/ha)\n- Low Phosphorus: Use DAP or SSP (30-50 kg/ha)\n- Low Potassium: Apply MOP (20-40 kg/ha)\n- Low pH: Add agricultural lime"
  }

  if (lower.includes('yield') || lower.includes('harvest') || lower.includes('production')) {
    return "Yield depends on soil quality, weather, crop variety, and farming practices. Use the Analyze page to get a yield prediction based on your inputs. To maximize yield:\n\n1. Choose crops suited to your soil and climate\n2. Ensure proper irrigation\n3. Apply fertilizers based on soil testing\n4. Practice timely sowing and harvesting"
  }

  if (lower.includes('ph')) {
    return "Soil pH affects nutrient availability:\n\n- Below 6.0 (acidic): Add agricultural lime (200-400 kg/ha)\n- 6.0-7.5 (optimal): Most crops thrive here\n- Above 7.5 (alkaline): Add organic compost or elemental sulfur\n\nRun a soil analysis on the Analyze page to check your soil's pH and get specific suggestions."
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm here to help with your farming questions. You can ask me about:\n\n- Crop recommendations\n- Soil health & pH\n- Fertilizer suggestions\n- Yield optimization\n\nOr go to the Analyze page to run a full soil analysis!"
  }

  return "Great question! For the most accurate answer, I'd recommend running a soil analysis on the Analyze page with your specific data. I can help with general questions about crops, soil health, fertilizers, and farming practices. What would you like to know more about?"
}
