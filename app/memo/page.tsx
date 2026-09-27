import { DetailHeader } from '@/components/layout/DetailHeader'
import { MemoList } from '@/components/memo/MemoList'

export default function MemoPage() {
  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="釣果メモ" />
      <main
        className="flex-1 overflow-y-auto px-3 py-4 max-w-2xl mx-auto w-full"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <MemoList />
      </main>
    </div>
  )
}
