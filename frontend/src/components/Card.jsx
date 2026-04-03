export default function Card({ children, className = '', hover = false, glass = false, glow, ...props }) {
  const glowRing = glow ? `ring-1 ring-${glow}-400/20 dark:ring-${glow}-500/10` : ''
  return (
    <div
      className={`
        rounded-2xl
        ${glass
          ? 'glass'
          : 'bg-white dark:bg-earth-800/50 border border-earth-200 dark:border-earth-700'}
        shadow-sm dark:shadow-none
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer' : 'transition-shadow duration-200'}
        ${glowRing}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ icon: Icon, title, badge, className = '' }) {
  return (
    <div className={`flex items-center gap-3 p-6 pb-0 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center text-sage-600 dark:text-sage-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="font-semibold text-earth-800 dark:text-earth-100">{title}</h3>
      {badge && (
        <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-sage-100 dark:bg-sage-900/40 text-sage-700 dark:text-sage-300">
          {badge}
        </span>
      )}
    </div>
  )
}
