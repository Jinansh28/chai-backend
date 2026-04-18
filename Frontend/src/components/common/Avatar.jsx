/**
 * Avatar component
 * - Shows image if src is provided
 * - Falls back to first letter of `name`
 */
const Avatar = ({ src, name = '', size = 'md', className = '', onClick }) => {
  const sizeMap = {
    xs:  'w-6 h-6 text-xs',
    sm:  'w-8 h-8 text-sm',
    md:  'w-10 h-10 text-base',
    lg:  'w-14 h-14 text-xl',
    xl:  'w-20 h-20 text-2xl',
  }

  const initial = name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div
      onClick={onClick}
      className={`
        ${sizeMap[size]}
        rounded-full overflow-hidden flex-shrink-0
        flex items-center justify-center
        bg-yt-surface text-yt-text font-semibold select-none
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  )
}

export default Avatar
