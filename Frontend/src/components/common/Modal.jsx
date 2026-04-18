import { useEffect } from 'react'

/**
 * Generic modal — renders children in a centered overlay
 * Closes on backdrop click or Escape key
 */
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`
          relative z-10 w-full ${maxWidth}
          bg-yt-surface border border-yt-border rounded-2xl
          shadow-2xl p-6 animate-fade-in
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-yt-text font-semibold text-lg">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-yt-muted hover:text-yt-text transition-colors p-1 rounded-full hover:bg-yt-surface-hover"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
