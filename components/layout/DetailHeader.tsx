import Link from 'next/link'

interface DetailHeaderProps {
  title: string
}

export function DetailHeader({ title }: DetailHeaderProps) {
  return (
    <header className="bg-lake-900 text-white px-4 pt-safe-top pb-3 flex items-center gap-3">
      <Link href="/" className="flex items-center justify-center w-10 h-10 rounded hover:bg-lake-800 transition-colors">
        <span className="text-2xl leading-none">‹</span>
      </Link>
      <h1 className="text-lg font-bold">{title}</h1>
    </header>
  )
}
