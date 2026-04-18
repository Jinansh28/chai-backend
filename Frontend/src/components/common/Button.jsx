/**
 * Button component
 * variant: "primary" | "secondary" | "ghost" | "danger" | "red"
 * size: "sm" | "md" | "lg"
 */
const variantMap = {
  primary:   'bg-white text-black hover:bg-gray-200',
  red:       'bg-yt-red text-white hover:bg-yt-red-dark',
  secondary: 'bg-yt-chip text-yt-text hover:bg-yt-surface-hover',
  ghost:     'bg-transparent text-yt-text hover:bg-yt-surface',
  danger:    'bg-red-700 text-white hover:bg-red-800',
}

const sizeMap = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2
      rounded-full font-medium
      transition-colors duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantMap[variant]}
      ${sizeMap[size]}
      ${className}
    `}
    {...rest}
  >
    {loading && (
      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    )}
    {children}
  </button>
)

export default Button
