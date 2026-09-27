import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { RefreshTimer } from '@/components/ui/RefreshTimer'
import { WarningBanner } from '@/components/ui/WarningBanner'
import { AreaTabs } from '@/components/AreaTabs'
import {
  MiniSun, MiniTide, MiniLevel, MiniDischarge, MiniDepth, CellSkeleton,
} from '@/components/cards/MiniCells'

export const revalidate = 300

function now() {
  return new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  })
}

export default function DashboardPage() {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#e8f2f8', overflow: 'hidden' }}>
      <Header updatedAt={now()} />
      <RefreshTimer intervalMs={300_000} />

      <Suspense fallback={null}>
        <WarningBanner />
      </Suspense>

      <AreaTabs>
        <Suspense fallback={<CellSkeleton />}><MiniSun /></Suspense>
        <MiniTide />
        <Suspense fallback={<CellSkeleton />}><MiniLevel /></Suspense>
        <Suspense fallback={<CellSkeleton />}><MiniDischarge /></Suspense>
        <MiniDepth />
      </AreaTabs>
    </div>
  )
}
