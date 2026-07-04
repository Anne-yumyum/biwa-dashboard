import Link from 'next/link'

interface DetailHeaderProps {
  title: string
}

export function DetailHeader({ title }: DetailHeaderProps) {
  return (
    <header
      style={{
        background: '#1a2b4b',
        borderBottom: '1px solid rgba(26, 43, 75, 0.2)',
        paddingTop: 'max(8px, env(safe-area-inset-top))',
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 8,
          color: '#ffffff',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
        className="hover:bg-gray-700"
      >
        <span style={{ fontSize: 24, lineHeight: 1 }}>‹</span>
      </Link>
      <h1 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>{title}</h1>
    </header>
  )
}
