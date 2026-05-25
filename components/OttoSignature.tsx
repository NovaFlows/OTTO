interface Props {
  size?: number
  opacity?: number
  className?: string
}

export default function OttoSignature({
  size = 20,
  opacity = 0.85,
  className = '',
}: Props) {
  const w = (size / 22) * 64
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 64 22"
      aria-hidden="true"
      className={`text-otto-chalk ${className}`}
      style={{ opacity, transform: 'translateY(2px) rotate(-3deg)' }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 9 12 C 6 11, 4 13.5, 5 15.5 C 6 17.5, 9 17, 10 15 C 10.5 13, 9 11, 8 12 L 11 3.5 L 12 16.5" />
        <path d="M 12.5 16 C 13.5 13, 15 12, 17 12.8 C 17.5 13.5, 17 14.5, 16.2 15" />
        <path d="M 18 14.2 C 19 12.8, 22 12.3, 23 13.3 C 23.3 14.5, 22 15.5, 20.4 15.4 C 19.4 15.3, 19 14.4, 20 13.8 L 24 14.8" />
        <path d="M 25 13 L 27 17 L 29 13 L 31.5 17 L 33.5 13" />
        <path d="M 36 13.5 L 36.4 17" />
        <circle cx="36.2" cy="10.8" r="0.55" fill="currentColor" />
        <path d="M 41 5.5 L 41.6 17 M 39 10.5 L 44.5 10" />
        <path d="M 44 17 C 48 17.5, 53 16.5, 58 14" />
      </g>
    </svg>
  )
}
