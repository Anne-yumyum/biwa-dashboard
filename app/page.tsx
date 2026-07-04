import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { LakeLevelCard } from '@/components/cards/LakeLevelCard'
import { DischargeCard } from '@/components/cards/DischargeCard'
import { TideCard } from '@/components/cards/TideCard'
import { SunCard } from '@/components/cards/SunCard'
import { DepthMapCard } from '@/components/cards/DepthMapCard'
import { RefreshTimer } from '@/components/ui/RefreshTimer'
import { WarningBanner } from '@/components/ui/WarningBanner'
import { AreaTabs } from '@/components/AreaTabs'

export const revalidate = 300

function now() {
  return new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  })
}

function Skeleton() {
  return <div className="card" style={{ background: '#d0e8f5', animation: 'pulse 1.5s ease-in-out infinite' }} />
}

export default function DashboardPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#e8f2f8' }}>
      <Header updatedAt={now()} />
      <RefreshTimer intervalMs={300_000} />

      {/* 警報・注意報バナー（発表時のみ表示） */}
      <Suspense fallback={null}>
        <WarningBanner />
      </Suspense>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '8px 8px',
        minHeight: 0,
        overflowY: 'auto',
      }}>
        {/* エリア別 風・天気・気温（タブ切り替え） */}
        <AreaTabs />

        {/* 日の出 | 潮汐 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flexShrink: 0 }}>
          <Suspense fallback={<Skeleton />}><SunCard /></Suspense>
          <TideCard />
        </div>

        {/* 水位 | 放流量 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, flexShrink: 0 }}>
          <Suspense fallback={<Skeleton />}><LakeLevelCard /></Suspense>
          <Suspense fallback={<Skeleton />}><DischargeCard /></Suspense>
        </div>

        {/* 等深線 */}
        <DepthMapCard />
      </main>

      {/* Footer: data source */}
      <div style={{
        padding: '6px 8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #c8dde8',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <p style={{ fontSize: 9, color: '#2a4a60', letterSpacing: '0.03em' }}>
          気象: Open-Meteo　警報: 気象庁　水位: 国土交通省　潮汐: 敦賀港参考値（天文計算）
        </p>
      </div>
    </div>
  )
}
