import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { formatViews, formatDuration, timeAgo } from '../../utils/formatters'

/**
 * VideoCard — used in Home, Search, Profile grids
 */
const VideoCard = ({ video }) => {
  if (!video) return null

  const {
    _id,
    thumbnail,
    title,
    description,
    views,
    duration,
    createdAt,
    owner,
  } = video

  return (
    <Link to={`/watch/${_id}`} className="group block">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-yt-surface rounded-xl overflow-hidden mb-3">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Duration badge */}
        {duration !== undefined && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Info row */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <Link
          to={`/channel/${owner?.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0 mt-0.5"
        >
          <Avatar src={owner?.avatar} name={owner?.fullName} size="sm" />
        </Link>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-yt-text font-medium text-sm line-clamp-2 leading-snug mb-1 group-hover:text-white transition-colors">
            {title}
          </h3>
          <Link
            to={`/channel/${owner?.username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-yt-muted text-xs hover:text-yt-text transition-colors"
          >
            {owner?.fullName || owner?.username}
          </Link>
          <p className="text-yt-muted text-xs mt-0.5">
            {formatViews(views)} views · {timeAgo(createdAt)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
