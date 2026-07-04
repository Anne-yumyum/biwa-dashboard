import { notFound } from 'next/navigation'
import { getArea, AREAS } from '@/lib/areas'
import { DetailHeader } from '@/components/layout/DetailHeader'
import { AreaDetail } from '@/components/AreaDetail'

export function generateStaticParams() {
  return AREAS.map(a => ({ id: a.id }))
}

export default async function AreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const area = getArea(id)
  if (!area) notFound()

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title={area.name} />
      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        <AreaDetail area={area} />
      </main>
    </div>
  )
}
