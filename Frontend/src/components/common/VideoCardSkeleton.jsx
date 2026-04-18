/**
 * VideoCardSkeleton — shown while videos are loading
 */
const VideoCardSkeleton = () => (
  <div className="block">
    {/* Thumbnail skeleton */}
    <div className="w-full aspect-video skeleton rounded-xl mb-3" />

    {/* Info row */}
    <div className="flex gap-3">
      {/* Avatar skeleton */}
      <div className="w-9 h-9 skeleton rounded-full flex-shrink-0 mt-0.5" />

      {/* Text skeletons */}
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 skeleton rounded w-full" />
        <div className="h-3.5 skeleton rounded w-4/5" />
        <div className="h-3 skeleton rounded w-2/5" />
      </div>
    </div>
  </div>
)

export default VideoCardSkeleton
