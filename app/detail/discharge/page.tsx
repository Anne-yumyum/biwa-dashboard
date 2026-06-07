import Link from 'next/link'
import { fetchDischarge } from '@/lib/discharge'

export default async function DischargeDetailPage() {
  const result = await fetchDischarge()
  const data = result.success ? result.data : null

  return (
    <div className="flex flex-col min-h-dvh bg-lake-50">
      <header className="bg-lake-900 text-white px-4 pt-safe-top pb-3 flex items-center gap-3">
        <Link href="/" className="text-lake-300 text-2xl leading-none">‹</Link>
        <h1 className="text-base font-bold">瀬田川洗堰 放流量 詳細</h1>
      </header>

      <main className="flex-1 px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="card">
          <p className="card-label mb-3">現在の放流量</p>
          {data ? (
            <div>
              <p className="data-value">{data.current}<span className="data-unit">m³/s</span></p>
              <p className="text-xs text-slate-400 mt-1">更新: {data.updatedAt}</p>
            </div>
          ) : (
            <div>
              <p className="text-slate-400 text-sm">取得できませんでした</p>
              <a href="https://www.kkr.mlit.go.jp/biwako/index.html"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-lake-600 underline font-medium">
                琵琶湖河川事務所サイトで確認 ↗
              </a>
            </div>
          )}
        </div>

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">瀬田川洗堰について</p>
          <p className="text-xs text-slate-600">
            琵琶湖唯一の自然流出河川・瀬田川の水門。<br />
            放流量を調節することで琵琶湖水位を管理。<br />
            増水時は放流量増加 → 下流の宇治川水位上昇。
          </p>
        </div>

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">国土交通省 琵琶湖河川事務所</p>
          <p className="text-xs text-slate-500 mt-1">kkr.mlit.go.jp/biwako/bousai/suii.html</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: リアルタイム（キャッシュ30分）</p>
          <p className="text-xs text-slate-400 mt-2">
            ※現在HTMLパース方式で取得中。<br />
            国交省APIへの正式申請後に切り替え予定。
          </p>
        </div>
      </main>
    </div>
  )
}
