interface Props {
  className?: string
  opacity?: number
  strokeWidth?: number
}

/**
 * Trait de craie horizontal pour séparer des sections.
 * Hérite la couleur courante via la classe `text-otto-chalk` →
 * s'adapte automatiquement aux thèmes jour/nuit.
 */
export default function ChalkDivider({
  className = '',
  opacity = 0.35,
  strokeWidth = 0.6,
}: Props) {
  return (
    <svg
      viewBox="0 0 1200 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-[14px] text-otto-chalk ${className}`}
      style={{ opacity }}
    >
      <path
        d="M 0 7 C 80 4, 160 9, 280 6 C 380 4, 480 9, 600 7 C 720 5, 820 9, 940 6 C 1040 4, 1120 8, 1200 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  )
}
