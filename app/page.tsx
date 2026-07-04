import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { WindCard } from '@/components/cards/WindCard'
import { WeatherCard } from '@/components/cards/WeatherCard'
import { TemperatureCard } from '@/components/cards/TemperatureCard'
import { LakeLevelCard } from '@/components/cards/LakeLevelCard'
import { DischargeCard } from '@/components/cards/DischargeCard'
import { TideCard } from '@/components/cards/TideCard'
import { SunCard } from '@/components/cards/SunCard'
import { RefreshTimer } from '@/components/ui/RefreshTimer'

export const revalidate = 0

function now() {
  return new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  })
}

function Skeleton() {
  return <div className="card" style={{ background: '#0d1a27', animation: 'pulse 1.5s ease-in-out infinite' }} />
}

export default function DashboardPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#e8f2f8' }}>
      <Header updatedAt={now()} />
      <RefreshTimer intervalMs={300_000} />

      {/* ── No-scroll cockpit grid ── */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr 1fr',
        gridTemplateColumns: '1fr',
        gap: 6,
        padding: '8px 8px',
        minHeight: 0,
      }}>
        {/* Row 1: Wind (full width) */}
        <Suspense fallback={<Skeleton />}>
          <WindCard />
        </Suspense>

        {/* Row 2: 天気 | 気温 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, minHeight: 0 }}>
          <Suspense fallback={<Skeleton />}><WeatherCard /></Suspense>
          <Suspense fallback={<Skeleton />}><TemperatureCard /></Suspense>
        </div>

        {/* Row 3: 日の出 | 潮汐 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, minHeight: 0 }}>
          <Suspense fallback={<Skeleton />}><SunCard /></Suspense>
          <TideCard />
        </div>

        {/* Row 4: 水位 | 放流量 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, minHeight: 0 }}>
          <Suspense fallback={<Skeleton />}><LakeLevelCard /></Suspense>
          <Suspense fallback={<Skeleton />}><DischargeCard /></Suspense>
        </div>
      </main>

      {/* Footer: data source */}
      <div style={{
        padding: '6px 8px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        borderTop: '1px solid #c8dde8',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        <p style={{ fontSize: 9, color: '#2a4a60', letterSpacing: '0.03em' }}>
          気象: Open-Meteo　水位: 国土交通省　潮汐: 敦賀港参考値（天文計算）
        </p>
      </div>
    </div>
  )
}
