export default function FormInput({ label, type = 'text', value, onChange, placeholder, required, min, max, step, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-earth-600 dark:text-earth-400 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-600 bg-white dark:bg-earth-800/50 text-earth-800 dark:text-earth-100 placeholder-earth-400 focus:ring-2 focus:ring-sage-500/40 focus:border-sage-500 focus:shadow-[0_0_0_4px_rgba(45,107,32,0.08)] outline-none transition-all duration-200"
      />
    </div>
  )
}
