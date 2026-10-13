'use client'

import Image from 'next/image'
import { useState } from 'react'
import QRCode from 'qrcode'

export default function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pageUrl, setPageUrl] = useState('')
  const [qr, setQr] = useState('')

  async function openModal() {
    const url = window.location.origin
    setPageUrl(url)
    setCopied(false)
    setQr('')
    setOpen(true)
    try {
      setQr(await QRCode.toDataURL(url, { margin: 0, width: 176, color: { dark: '#17131f', light: '#ffffff' } }))
    } catch {}
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
    } catch {}
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-label="Compartilhar"
        className="glass flex h-11 w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-glass-hover"
        style={{ borderRadius: '50%' }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Compartilhar"
            className="flex w-full max-w-sm flex-col gap-5 rounded-3xl border border-glass-border bg-surface p-6 shadow-[var(--shadow)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Compartilhar</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-glass-hover"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mx-auto rounded-[18px] bg-white p-3.5">
              <div className="h-[176px] w-[176px]">
                {qr && <Image src={qr} alt="QR code da página" width={176} height={176} unoptimized className="block h-full w-full" />}
              </div>
            </div>
            <p className="text-center text-[13px] text-muted">Aponte a câmera para abrir a página</p>
            <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-field py-1.5 pl-3.5 pr-1.5">
              <span className="flex-1 truncate text-sm">{pageUrl}</span>
              <button
                type="button"
                onClick={copy}
                className="h-9 cursor-pointer rounded-[9px] bg-accent px-3.5 text-[13px] font-semibold text-accent-fg"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
