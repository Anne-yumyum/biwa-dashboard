import { calculateTides } from '@/lib/tide'
import { DetailHeader } from '@/components/layout/DetailHeader'

export default function TideDetailPage() {
  const result = calculateTides(new Date())
  const entries = result.success ? result.data.entries : []
  const highs = entries.filter(e => e.type === 'high')
  const lows = entries.filter(e => e.type === 'low')

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="潮汐 詳細" />

      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="card">
          <p className="card-label mb-3">本日の潮汐（敦賀港参考値）</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="data-label text-sky-600 mb-2">満潮</p>
              {highs.map((e, i) => (
                <p key={i} className="text-xl font-bold text-slate-900 font-mono">{e.time}</p>
              ))}
            </div>
            <div>
              <p className="data-label text-amber-600 mb-2">干潮</p>
              {lows.map((e, i) => (
                <p key={i} className="text-xl font-bold text-slate-900 font-mono">{e.time}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">天文計算（調和定数）</p>
          <p className="text-xs text-slate-500 mt-1">参考地点: 敦賀港（北緯35.65° / 東経136.06°・琵琶湖から約45km）</p>
          <p className="text-xs text-slate-500 mt-1">使用調和定数: K1・O1・M2・S2・N2・P1</p>
          <p className="text-xs text-slate-500">出典: 海上保安庁水路部 潮汐観測資料（近似値）</p>
          <p className="text-xs text-slate-400 mt-1">外部API不使用・サーバーサイド計算</p>
        </div>
      </main>
    </div>
  )
}
