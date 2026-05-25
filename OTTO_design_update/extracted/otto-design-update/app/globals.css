@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Thème nuit (défaut) ── */
:root {
  --c-bg:      6   6   6;
  --c-bg2:     17  17  17;
  --c-chalk:   242 240 235;
  --c-white:   255 255 255;
  --c-grey:    138 138 138;
  --noise-opacity: 0.04;
  --trace-color: 255 255 255;
}

/* ── Thème jour ── */
[data-theme="light"] {
  --c-bg:      236 234 228;
  --c-bg2:     220 217 210;
  --c-chalk:   17  17  17;
  --c-white:   6   6   6;
  --c-grey:    110 108 104;
  --noise-opacity: 0.025;
  --trace-color: 6 6 6;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: rgb(var(--c-bg));
  color: rgb(var(--c-chalk));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* ── Les traces SVG héritent la couleur du thème ── */
[data-theme="light"] .bg-traces svg {
  color: rgb(var(--trace-color));
}

/* ── Grain overlay ── */
.grain-overlay {
  position: fixed;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: var(--noise-opacity);
  pointer-events: none;
  z-index: 9999;
  animation: grain 0.4s steps(1) infinite;
}

@keyframes grain {
  0%,100% { transform: translate(0,    0);    }
  10%      { transform: translate(-1%, -1%);  }
  20%      { transform: translate(1%,   0%);  }
  30%      { transform: translate(0%,   1%);  }
  40%      { transform: translate(-1%,  0%);  }
  50%      { transform: translate(1%,   1%);  }
  60%      { transform: translate(0%,  -1%);  }
  70%      { transform: translate(-1%,  1%);  }
  80%      { transform: translate(1%,  -1%);  }
  90%      { transform: translate(0%,   0%);  }
}

/* ── Animation des traces — apparition progressive ── */
.trace-draw {
  stroke-dasharray: 3000;
  stroke-dashoffset: 3000;
  animation: traceDraw linear forwards;
}

.trace-1  { animation-delay: 0.0s; animation-duration: 4.5s; }
.trace-2  { animation-delay: 0.2s; animation-duration: 5.5s; }
.trace-3  { animation-delay: 0.4s; animation-duration: 5.0s; }
.trace-4  { animation-delay: 0.1s; animation-duration: 4.0s; }
.trace-5  { animation-delay: 0.3s; animation-duration: 4.5s; }
.trace-6  { animation-delay: 0.5s; animation-duration: 4.2s; }
.trace-7  { animation-delay: 0.7s; animation-duration: 3.5s; }
.trace-8  { animation-delay: 0.8s; animation-duration: 3.8s; }
.trace-9  { animation-delay: 1.0s; animation-duration: 3.5s; }
.trace-10 { animation-delay: 1.2s; animation-duration: 2.5s; }
.trace-11 { animation-delay: 1.3s; animation-duration: 2.5s; }
.trace-12 { animation-delay: 1.1s; animation-duration: 2.5s; }
.trace-13 { animation-delay: 1.4s; animation-duration: 2.5s; }
.trace-14 { animation-delay: 1.5s; animation-duration: 2.5s; }
.trace-15 { animation-delay: 0.6s; animation-duration: 4.2s; }
.trace-16 { animation-delay: 0.9s; animation-duration: 4.0s; }
.trace-17 { animation-delay: 0.2s; animation-duration: 5.5s; }
.trace-18 { animation-delay: 0.0s; animation-duration: 6.0s; }

@keyframes traceDraw {
  to { stroke-dashoffset: 0; }
}

/* ── Animations craie ambiantes (utilisées par ChalkAmbient.tsx) ── */
@keyframes chalkDraw { to { stroke-dashoffset: 0; } }
@keyframes chalkDot  { 0% { opacity: 0; } 25% { opacity: 1; } 100% { opacity: 0.85; } }

/* ── Scroll-triggered fade ── */
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Link underline grow ── */
.link-underline {
  position: relative;
  text-decoration: none;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}
.link-underline:hover::after {
  width: 100%;
}

/* ── Soulignement « trait de craie » pour l'état actif ── */
.chalk-under {
  position: relative;
  padding-bottom: 8px;
}
.chalk-under[data-active="true"]::after {
  content: '';
  position: absolute;
  left: -4px;
  right: -4px;
  bottom: 0;
  height: 6px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'><path d='M0,3 C20,1 40,5 60,2.5 C75,0.5 90,4.5 100,2.5' stroke='%23F2F0EB' stroke-width='1' fill='none' stroke-linecap='round'/></svg>") center/100% 100% no-repeat;
  opacity: 0.85;
}
[data-theme="light"] .chalk-under[data-active="true"]::after {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 6' preserveAspectRatio='none'><path d='M0,3 C20,1 40,5 60,2.5 C75,0.5 90,4.5 100,2.5' stroke='%23060606' stroke-width='1' fill='none' stroke-linecap='round'/></svg>");
}

/* ── Card "cadre tableau" (utilisé par OeuvreCard) ── */
.frame {
  position: relative;
  background-color: rgb(var(--c-bg2));
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.04),
    0 30px 60px -30px rgba(0,0,0,0.6),
    0 1px 0 rgba(255,255,255,0.02);
  transition: box-shadow 0.6s ease;
}
.frame:hover {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.10),
    0 40px 80px -20px rgba(0,0,0,0.8),
    0 0 80px -10px rgba(255,255,255,0.05);
}
[data-theme="light"] .frame {
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.06),
    0 30px 60px -30px rgba(0,0,0,0.18),
    0 1px 0 rgba(0,0,0,0.03);
}
[data-theme="light"] .frame:hover {
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.12),
    0 40px 80px -20px rgba(0,0,0,0.25),
    0 0 80px -10px rgba(0,0,0,0.06);
}

/* ── Custom scrollbar ── */
::-webkit-scrollbar       { width: 2px; }
::-webkit-scrollbar-track { background: rgb(var(--c-bg)); }
::-webkit-scrollbar-thumb { background: rgb(var(--c-bg2)); }

/* ── Selection ── */
::selection {
  background: rgba(128,128,128,0.15);
  color: rgb(var(--c-chalk));
}

/* ── Artwork placeholder glow variants ── */
.glow-dancer {
  background: radial-gradient(ellipse 55% 65% at 50% 80%, rgba(255,255,255,0.1) 0%, transparent 70%);
}
.glow-crow {
  background: radial-gradient(ellipse 60% 45% at 50% 25%, rgba(255,255,255,0.09) 0%, transparent 65%);
}
.glow-silhouette {
  background: radial-gradient(ellipse 40% 55% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 65%);
}
.glow-sketch {
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%);
}
