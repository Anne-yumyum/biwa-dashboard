export function CardSkeleton({ label }: { label?: string }) {
  return (
    <div className="card animate-pulse">
      {label && (
        <p className="card-label mb-2">{label}</p>
      )}
      <div className="h-10 bg-slate-200 rounded w-2/3 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  )
}

export function CardError({ label, message }: { label?: string; message?: string }) {
  return (
    <div className="card border-red-100">
      {label && <p className="card-label mb-1">{label}</p>}
      <p className="text-red-400 text-sm">
        {message ?? '取得できませんでした'}
      </p>
    </div>
  )
}
