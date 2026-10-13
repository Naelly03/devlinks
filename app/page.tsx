import Image from 'next/image'
import { prisma } from '../lib/prisma'
import Backdrop from './components/Backdrop'
import LinkIcon, { getLinkKind } from './components/LinkIcon'
import ShareButton from './components/ShareButton'
import ThemeToggle from './components/ThemeToggle'

async function getLinks() {
  const links = await prisma.link.findMany({
    where: { active: true },
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
  })
  return links
}

function formatUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

export default async function Home() {
  const links = await getLinks()

  return (
    <div className="relative min-h-screen overflow-hidden bg-page text-ink">
      <Backdrop />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-5 pb-12 pt-6">
        <div className="flex w-full max-w-[440px] justify-between">
          <ShareButton />
          <ThemeToggle className="rounded-full" />
        </div>

        <div className="flex w-full max-w-[440px] flex-1 flex-col justify-center pt-2">
          <div className="fade-up mb-8 flex flex-col items-center text-center">
            <div className="rounded-full bg-gradient-to-br from-accent-soft to-accent p-[3px] shadow-[0_18px_50px_-12px_var(--accent-glow)]">
              <Image
                src="https://github.com/Naelly03.png"
                alt="Foto de Naelly Vitoria"
                width={108}
                height={108}
                priority
                className="block h-[108px] w-[108px] rounded-full border-4 border-page bg-glass object-cover"
              />
            </div>
            <h1 className="mb-1.5 mt-[22px] font-display text-[30px] font-bold tracking-tight">
              Naelly Vitoria
            </h1>
            <p className="text-base text-muted">Developer &amp; Tech Enthusiast</p>
          </div>

          <div className="flex flex-col gap-3">
            {links.length === 0 ? (
              <p className="text-center text-muted">Nenhum link cadastrado ainda...</p>
            ) : (
              links.map((link, i) => (
                <div
                  key={link.id}
                  className="fade-up"
                  style={{ '--delay': `${(0.18 + i * 0.09).toFixed(2)}s` } as React.CSSProperties}
                >
                  <a
                    href={formatUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass flex items-center gap-3.5 rounded-[18px] py-2.5 pl-2.5 pr-4 text-ink shadow-[var(--shadow)] transition duration-200 hover:-translate-y-[3px] hover:border-accent hover:bg-glass-hover"
                  >
                    <LinkIcon kind={getLinkKind(link.title, link.url)} size={44} />
                    <span className="flex-1 text-base font-semibold">{link.title}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </a>
                </div>
              ))
            )}
          </div>

          <a
            href="/login"
            className="mt-10 inline-flex h-[46px] items-center gap-2.5 self-center rounded-full border border-dashed border-accent-soft px-5 text-sm font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:bg-glass-hover"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Área admin
          </a>
        </div>
      </div>
    </div>
  )
}
