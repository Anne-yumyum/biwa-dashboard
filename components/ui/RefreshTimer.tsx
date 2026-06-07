'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export function RefreshTimer({ intervalMs = 300_000 }: { intervalMs?: number }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => router.refresh())
    }, intervalMs)
    return () => clearInterval(id)
  }, [router, intervalMs])

  return null
}

export function RefreshButton() {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)

  function handleRefresh() {
    setSpinning(true)
    router.refresh()
    setTimeout(() => setSpinning(false), 1200)
  }

  return (
    <button
      onClick={handleRefresh}
      className="text-slate-400 active:text-white transition-colors p-1"
      aria-label="更新"
    >
      <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={spinning ? { animation: 'spin 1s linear infinite' } : {}}
      >
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
      </svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}
