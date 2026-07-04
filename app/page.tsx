import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { SunCard } from '@/components/cards/SunCard'
import { TideCard } from '@/components/cards/TideCard'
import { RefreshTimer } from '@/components/ui/RefreshTimer'
import { WarningBanner } from '@/components/ui/WarningBanner'
import { BiwaLakeMap } from '@/components/map/BiwaLakeMap'

// 5分キャッシュ: 毎リクエストのAPI乱打を防ぐ
export const revalidate = 300

function now() {
  return new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  })
}

function Skeleton() {
  return <div className="card" style={{ background: '#d0e8f5', animation: 'pulse 1.5s ease-in-out infinite' }} />
}

export default async function DashboardPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#e8f2f8' }}>
      <Header updatedAt={now()} />
      <RefreshTimer intervalMs={300_000} />

      {/* 警報バナー */}
      <Suspense fallback={null}>
        <WarningBanner />
      </Suspense>

      {/* メインコンテンツ */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 8px 4px',
        gap: 6,
        minHeight: 0,
        overflowY: 'auto',
      }}>
        {/* 琵琶湖マップ */}
        <div className="card" style={{ flex: '0 0 auto', padding: '10px 8px 8px' }}>
          <p className="card-label" style={{ marginBottom: 6, fontSize: 12 }}>
            🗾 琵琶湖 エリア選択
          </p>
          <BiwaLakeMap />
          <p style={{ fontSize: 9, color: '#94a3b8', textAlign: 'center', marginTop: 4 }}>
            エリアをタップして詳細を確認
          </p>
        </div>

        {/* 日の出 | 潮汐 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flexShrink: 0 }}>
          <Suspense fallback={<Skeleton />}><SunCard /></Suspense>
          <TideCard />
        </div>
      </main>

      {/* フッター */}
      <div style={{
        padding: '5px 8px',
        paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #c8dde8',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <p style={{ fontSize: 9, color: '#2a4a60', letterSpacing: '0.03em' }}>
          気象: Open-Meteo　警報: 気象庁　潮汐: 敦賀港（天文計算）
        </p>
      </div>
    </div>
  )
}
