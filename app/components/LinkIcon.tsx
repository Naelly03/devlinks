export type LinkKind = 'github' | 'linkedin' | 'globe' | 'link'

export function getLinkKind(title: string, url: string): LinkKind {
  const text = `${title} ${url}`.toLowerCase()

  if (text.includes('github')) return 'github'
  if (text.includes('linkedin')) return 'linkedin'
  if (text.includes('portifolio') || text.includes('portfolio') || text.includes('vercel.app')) {
    return 'globe'
  }
  return 'link'
}

const backgrounds: Record<LinkKind, string> = {
  github: '#2b3139',
  linkedin: '#0a66c2',
  globe: 'var(--accent)',
  link: '#4b4660',
}

export default function LinkIcon({ kind, size = 44 }: { kind: LinkKind; size?: number }) {
  const icon = Math.round(size * 0.5)

  return (
    <div
      className="flex flex-none items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: backgrounds[kind],
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)',
      }}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke={kind === 'globe' ? 'var(--accent-fg)' : '#fff'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {kind === 'github' && (
          <>
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </>
        )}
        {kind === 'linkedin' && (
          <>
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </>
        )}
        {kind === 'globe' && (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </>
        )}
        {kind === 'link' && (
          <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </>
        )}
      </svg>
    </div>
  )
}
