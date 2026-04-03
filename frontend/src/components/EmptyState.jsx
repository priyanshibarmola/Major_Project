import { Sprout } from 'lucide-react'

export default function EmptyState({ icon: Icon = Sprout, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-earth-100 to-earth-200 dark:from-earth-800 dark:to-earth-700 flex items-center justify-center mb-5 animate-float">
        <Icon className="w-10 h-10 text-earth-400 dark:text-earth-500" />
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sage-400/40 animate-ping" />
      </div>
      <h3 className="font-bold text-earth-800 dark:text-earth-200 text-lg mb-2">{title}</h3>
      <p className="text-earth-500 dark:text-earth-400 max-w-sm leading-relaxed">{description}</p>
    </div>
  )
}
