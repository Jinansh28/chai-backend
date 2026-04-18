/** Format view count: 1200000 → "1.2M", 5300 → "5.3K" */
export const formatViews = (views) => {
  if (!views && views !== 0) return '0'
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000)     return `${(views / 1_000).toFixed(1)}K`
  return views.toString()
}

/** Format seconds to "H:MM:SS" or "M:SS" */
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Relative time: "3 days ago", "just now" */
export const timeAgo = (date) => {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const s  = Math.floor(diff / 1000)
  const m  = Math.floor(s  / 60)
  const h  = Math.floor(m  / 60)
  const d  = Math.floor(h  / 24)
  const w  = Math.floor(d  / 7)
  const mo = Math.floor(d  / 30)
  const y  = Math.floor(d  / 365)

  if (y  > 0) return `${y} year${y   > 1 ? 's' : ''} ago`
  if (mo > 0) return `${mo} month${mo > 1 ? 's' : ''} ago`
  if (w  > 0) return `${w} week${w   > 1 ? 's' : ''} ago`
  if (d  > 0) return `${d} day${d    > 1 ? 's' : ''} ago`
  if (h  > 0) return `${h} hour${h   > 1 ? 's' : ''} ago`
  if (m  > 0) return `${m} minute${m > 1 ? 's' : ''} ago`
  return 'just now'
}
