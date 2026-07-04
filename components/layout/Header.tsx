import { RefreshButton } from '@/components/ui/RefreshTimer'

interface HeaderProps {
  updatedAt: string
}

export function Header({ updatedAt }: HeaderProps) {
  return (
    <header
      style={{
        background: '#1a2b4b',
        borderBottom: '1px solid rgba(26, 43, 75, 0.2)',
        padding: `max(8px, env(safe-area-inset-top)) 16px 8px`,
      }}
    >
      <div className="flex items-center justify-between" style={{ paddingTop: 8 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.01em' }}>
            ビワマスナビ
          </h1>
          <p style={{ fontSize: 11, color: '#8da0c0', marginTop: 2, letterSpacing: '0.04em' }}>
            出船前コンディションチェック
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p style={{ fontSize: 10, color: '#8da0c0', lineHeight: 1 }}>最終更新</p>
            <p style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.2 }}>
              {updatedAt}
            </p>
          </div>
          <RefreshButton />
        </div>
      </div>
    </header>
  )
}
