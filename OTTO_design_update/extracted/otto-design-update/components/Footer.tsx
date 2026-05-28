import Link from 'next/link'
import OttoSignature from '@/components/OttoSignature'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6 md:px-12 mt-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="font-serif text-lg text-otto-chalk leading-none">OTTO</span>
          <OttoSignature size={16} opacity={0.75} className="ml-0.5" />
        </Link>

        <div className="flex items-center gap-8">
          <a
            href="https://www.instagram.com/ottodrewit/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@ottodrewit"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
          >
            TikTok
          </a>
          <a
            href="mailto:contact@ottodrewit.com"
            className="font-mono text-[11px] text-otto-grey hover:text-otto-chalk uppercase tracking-[0.18em] transition-colors duration-200 link-underline"
          >
            Email
          </a>
        </div>

        <p className="font-mono text-[10px] text-otto-grey/40 tracking-wide">
          © Otto {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
