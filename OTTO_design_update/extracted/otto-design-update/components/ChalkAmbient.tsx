'use client'

import { useEffect } from 'react'

/**
 * Traits de craie qui apparaissent aléatoirement sur toute la hauteur
 * du document. Cinq familles de gestes inspirés des toiles d'Otto :
 *  – traits courbes  (court geste)
 *  – traînées       (envol des danseuses)
 *  – coulures        (silhouettes)
 *  – éclaboussures   (poussière)
 *  – zigzag brossé   (silhouettes brossées)
 *
 * Le calque est positionné en `absolute` sur tout le document → les
 * traits restent ancrés à la page et défilent avec le contenu.
 */
export default function ChalkAmbient() {
  useEffect(() => {
    const layer = document.createElement('div')
    layer.style.cssText =
      'position:absolute;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:2;overflow:hidden;'
    document.body.appendChild(layer)

    // ── Garde le calque à la hauteur du document ──────────
    const sizeLayer = () => {
      layer.style.height =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          window.innerHeight,
        ) + 'px'
    }
    sizeLayer()
    window.addEventListener('resize', sizeLayer)
    const sizeInterval = window.setInterval(sizeLayer, 1500)

    const MAX = 5
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

    // ── Bibliothèques de gestes ──────────────────────────
    const shortStrokes = [
      'M 4 26 Q 50 8, 100 22 T 196 18',
      'M 2 18 C 32 6, 64 30, 100 16 S 160 4, 196 16',
      'M 0 26 Q 44 36, 88 20 Q 132 6, 196 26',
      'M 8 30 Q 50 16, 94 26 T 160 22 L 196 24',
      'M 4 20 C 30 10, 56 32, 88 20 C 124 8, 158 30, 196 20',
      'M 0 28 Q 36 14, 72 26 Q 108 36, 144 22 Q 172 14, 196 22',
      'M 6 14 Q 44 30, 88 16 Q 134 4, 196 18',
    ]
    const longTrails = [
      'M 0 38 Q 90 6, 190 30 T 380 26',
      'M 4 26 C 70 70, 180 -10, 250 32 S 340 70, 380 34',
      'M 0 44 Q 100 12, 200 36 Q 280 52, 380 28',
      'M 2 24 Q 110 58, 210 20 Q 310 -8, 380 32',
    ]

    // ── Helpers ──────────────────────────────────────────
    const makeSVG = (w: number, h: number) => {
      const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      s.setAttribute('width', String(w))
      s.setAttribute('height', String(h))
      s.setAttribute('viewBox', `0 0 ${w} ${h}`)
      return s
    }

    const spawnPos = (w: number, h: number) => {
      const x = rand(0, Math.max(0, window.innerWidth - w))
      const y =
        window.scrollY + rand(20, Math.max(40, window.innerHeight - h - 20))
      return { x, y }
    }

    const mountSVG = (svg: SVGSVGElement, holdMs: number, fadeMs = 2400) => {
      layer.appendChild(svg)
      const drawMs = parseFloat(svg.dataset.drawMs || '2500')
      window.setTimeout(() => {
        svg.style.opacity = '0'
      }, drawMs + holdMs)
      window.setTimeout(() => {
        svg.remove()
      }, drawMs + holdMs + fadeMs + 200)
    }

    // ── TYPE A : trait courbe long ───────────────────────
    function spawnShortStroke() {
      const w = 200, h = 40
      const svg = makeSVG(w, h)
      const { x, y } = spawnPos(w, h)
      const sc = rand(0.65, 1.5)
      const rot = rand(-20, 20)
      const op = rand(0.18, 0.30)
      svg.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:scale(${sc}) rotate(${rot}deg);transform-origin:center;color:rgb(var(--trace-color));opacity:${op};transition:opacity 2.4s ease;`

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pick(shortStrokes))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'currentColor')
      path.setAttribute('stroke-width', rand(0.5, 1.1).toFixed(2))
      path.setAttribute('stroke-linecap', 'round')
      const dur = rand(2.8, 4.6)
      path.style.cssText = `stroke-dasharray:480;stroke-dashoffset:480;animation:chalkDraw ${dur}s ease-out forwards;`
      svg.appendChild(path)
      svg.dataset.drawMs = (dur * 1000).toString()

      if (Math.random() < 0.3) {
        for (let i = 0; i < rand(2, 5); i++) {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          c.setAttribute('cx', rand(140, 195).toFixed(1))
          c.setAttribute('cy', rand(10, 32).toFixed(1))
          c.setAttribute('r', rand(0.4, 1.3).toFixed(2))
          c.setAttribute('fill', 'currentColor')
          c.style.cssText = `opacity:0;animation:chalkDot 1.6s ease-out forwards;animation-delay:${rand(1.2, 2.4)}s;`
          svg.appendChild(c)
        }
      }
      mountSVG(svg, rand(1800, 3400))
    }

    // ── TYPE B : traînée longue (envol) ──────────────────
    function spawnLongTrail() {
      const w = 380, h = 70
      const svg = makeSVG(w, h)
      const { x, y } = spawnPos(w, h)
      const sc = rand(0.6, 1.1)
      const rot = rand(-10, 10)
      const op = rand(0.10, 0.22)
      svg.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:scale(${sc}) rotate(${rot}deg);transform-origin:center;color:rgb(var(--trace-color));opacity:${op};transition:opacity 3s ease;`

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pick(longTrails))
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'currentColor')
      path.setAttribute('stroke-width', rand(0.4, 0.85).toFixed(2))
      path.setAttribute('stroke-linecap', 'round')
      const dur = rand(4.2, 6.0)
      path.style.cssText = `stroke-dasharray:900;stroke-dashoffset:900;animation:chalkDraw ${dur}s ease-out forwards;`
      svg.appendChild(path)
      svg.dataset.drawMs = (dur * 1000).toString()
      mountSVG(svg, rand(2200, 3800), 3000)
    }

    // ── TYPE C : coulures verticales ─────────────────────
    function spawnDrips() {
      const w = 100, h = 200
      const svg = makeSVG(w, h)
      const { x, y } = spawnPos(w, h)
      const sc = rand(0.7, 1.2)
      const op = rand(0.10, 0.22)
      svg.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:scale(${sc});transform-origin:top center;color:rgb(var(--trace-color));opacity:${op};transition:opacity 2.6s ease;`

      const count = Math.floor(rand(5, 11))
      let maxDur = 0
      for (let i = 0; i < count; i++) {
        const px = rand(8, w - 8)
        const startY = rand(2, 22)
        const len = rand(70, 180)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute(
          'd',
          `M ${px.toFixed(1)} ${startY.toFixed(1)} L ${px.toFixed(1)} ${(
            startY + len
          ).toFixed(1)}`,
        )
        path.setAttribute('stroke', 'currentColor')
        path.setAttribute('stroke-width', rand(0.3, 0.75).toFixed(2))
        path.setAttribute('stroke-linecap', 'round')
        path.setAttribute('fill', 'none')
        const dur = rand(2.8, 4.6)
        maxDur = Math.max(maxDur, dur)
        const delay = rand(0, 0.7)
        path.style.cssText = `stroke-dasharray:${len.toFixed(0)};stroke-dashoffset:${len.toFixed(0)};animation:chalkDraw ${dur}s ease-in forwards;animation-delay:${delay}s;`
        svg.appendChild(path)
      }
      svg.dataset.drawMs = (maxDur * 1000 + 700).toString()
      mountSVG(svg, rand(1800, 3200))
    }

    // ── TYPE D : éclaboussures pures ─────────────────────
    function spawnSplatter() {
      const w = 130, h = 130
      const svg = makeSVG(w, h)
      const { x, y } = spawnPos(w, h)
      const sc = rand(0.6, 1.4)
      const rot = rand(0, 360)
      const op = rand(0.15, 0.28)
      svg.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:scale(${sc}) rotate(${rot}deg);transform-origin:center;color:rgb(var(--trace-color));opacity:${op};transition:opacity 2.4s ease;`

      const count = Math.floor(rand(12, 26))
      let maxEnd = 0
      for (let i = 0; i < count; i++) {
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        const r = Math.sqrt(Math.random()) * 56
        const a = Math.random() * Math.PI * 2
        c.setAttribute('cx', (65 + Math.cos(a) * r).toFixed(1))
        c.setAttribute('cy', (65 + Math.sin(a) * r).toFixed(1))
        c.setAttribute('r', rand(0.35, 1.7).toFixed(2))
        c.setAttribute('fill', 'currentColor')
        const delay = rand(0, 1.6)
        const dur = rand(1.6, 2.6)
        maxEnd = Math.max(maxEnd, delay + dur)
        c.style.cssText = `opacity:0;animation:chalkDot ${dur}s ease-out forwards;animation-delay:${delay}s;`
        svg.appendChild(c)
      }
      svg.dataset.drawMs = (maxEnd * 1000).toString()
      mountSVG(svg, rand(900, 2000), 2200)
    }

    // ── TYPE E : zigzag scratchy ─────────────────────────
    function spawnScratch() {
      const w = 130, h = 200
      const svg = makeSVG(w, h)
      const { x, y } = spawnPos(w, h)
      const sc = rand(0.6, 1.1)
      const rot = rand(-25, 25)
      const op = rand(0.12, 0.24)
      svg.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:scale(${sc}) rotate(${rot}deg);transform-origin:center;color:rgb(var(--trace-color));opacity:${op};transition:opacity 2.4s ease;`

      let d = `M ${rand(20, 40).toFixed(1)} ${rand(5, 15).toFixed(1)}`
      const steps = Math.floor(rand(10, 18))
      for (let i = 0; i < steps; i++) {
        d += ` L ${rand(15, 115).toFixed(1)} ${(15 + i * (175 / steps)).toFixed(1)}`
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', 'currentColor')
      path.setAttribute('stroke-width', rand(0.4, 0.85).toFixed(2))
      path.setAttribute('stroke-linecap', 'round')
      const dur = rand(3.4, 5.2)
      path.style.cssText = `stroke-dasharray:780;stroke-dashoffset:780;animation:chalkDraw ${dur}s ease-out forwards;`
      svg.appendChild(path)
      svg.dataset.drawMs = (dur * 1000).toString()
      mountSVG(svg, rand(1600, 2800))
    }

    // ── Ordonnanceur ─────────────────────────────────────
    const spawners = [
      spawnShortStroke, spawnShortStroke, spawnShortStroke,
      spawnLongTrail, spawnLongTrail,
      spawnDrips,
      spawnSplatter, spawnSplatter,
      spawnScratch,
    ]

    let alive = true
    function tick() {
      if (!alive) return
      if (layer.children.length < MAX) {
        pick(spawners)()
      }
      window.setTimeout(tick, rand(1500, 3500))
    }

    // Démarrage : quelques jets initiaux + tick
    const t1 = window.setTimeout(spawnShortStroke, 400)
    const t2 = window.setTimeout(spawnSplatter, 1200)
    const t3 = window.setTimeout(spawnLongTrail, 2200)
    const t4 = window.setTimeout(spawnDrips, 3000)
    const t5 = window.setTimeout(tick, 3600)

    return () => {
      alive = false
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
      window.clearInterval(sizeInterval)
      window.removeEventListener('resize', sizeLayer)
      layer.remove()
    }
  }, [])

  return null
}
