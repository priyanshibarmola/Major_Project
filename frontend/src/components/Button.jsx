export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'
  const variants = {
    primary: 'bg-sage-600 hover:bg-sage-700 text-white glow-sage',
    secondary: 'bg-earth-100 dark:bg-earth-700/50 hover:bg-earth-200 dark:hover:bg-earth-600 text-earth-800 dark:text-earth-100 shadow-sm hover:shadow-md',
    outline: 'border-2 border-sage-500 text-sage-600 dark:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/30 hover:shadow-md',
    ghost: 'text-earth-600 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800',
  }
  const sizes = {
    sm: 'gap-1.5 px-4 py-2 text-sm',
    md: 'gap-2 px-6 py-3 text-base',
    lg: 'gap-2.5 px-8 py-4 text-lg',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
