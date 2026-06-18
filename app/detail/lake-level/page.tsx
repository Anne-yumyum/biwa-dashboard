import { fetchLakeLevel } from '@/lib/lakeLevel'
import { DetailHeader } from '@/components/layout/DetailHeader'

export default async function LakeLevelDetailPage() {
  const result = await fetchLakeLevel()
  const data = result.success ? result.data : null

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="琵琶湖水位 詳細" />

      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="card">
          <p className="card-label mb-3">現在の水位</p>
          {data ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="data-label">現在水位</p>
                <p className="data-value">
                  {data.current >= 0 ? '+' : ''}{data.current}
                  <span className="data-unit">cm</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">BSL基準</p>
              </div>
              {data.diffFromYesterday !== null && (
                <div>
                  <p className="data-label">前日比</p>
                  <p className={`data-value ${data.diffFromYesterday > 0 ? 'text-sky-600' : data.diffFromYesterday < 0 ? 'text-amber-600' : ''}`}>
                    {data.diffFromYesterday >= 0 ? '+' : ''}{data.diffFromYesterday}
                    <span className="data-unit">cm</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-slate-400 text-sm">取得できませんでした</p>
              <a href="http://www1.river.go.jp/cgi-bin/DspWaterData.exe?KIND=9&ID=306041286603280"
                target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-lake-600 underline font-medium">
                国交省サイトで確認 ↗
              </a>
            </div>
          )}
        </div>

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">BSL基準について</p>
          <p className="text-xs text-slate-600">
            BSL（Biwako Surface Level）は琵琶湖水位の基準面。<br />
            BSL 0cm = T.P. +84.371m<br />
            通常は -20cm〜+30cm の範囲で変動。
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
