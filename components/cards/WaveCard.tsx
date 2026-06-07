export function WaveCard() {
  // 琵琶湖の波高は公開APIなし - データなし表示
  return (
    <div className="card">
      <p className="card-label">🌊 波高</p>
      <div className="mt-2">
        <p className="text-slate-400 text-sm">データなし</p>
        <p className="text-xs text-slate-300 mt-1">琵琶湖の波高公開データなし</p>
      </div>
    </div>
  )
}
