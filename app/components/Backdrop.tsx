export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 55% at 50% -8%, var(--glow-1), transparent 70%), radial-gradient(ellipse 55% 45% at 100% 105%, var(--glow-2), transparent 70%), radial-gradient(ellipse 45% 40% at -5% 70%, var(--glow-3), transparent 70%)',
      }}
    />
  )
}
