// Loading Indicator Component

export function LoadingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm">Szukam najlepszych opcji...</span>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-border rounded w-3/4" />
      <div className="h-4 bg-border rounded w-1/2" />
      <div className="h-32 bg-border rounded" />
    </div>
  )
}
