import { ScrollText, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import type { CSSProperties } from 'react'

/**
 * Декоративная анимация: «документ, который пишет невидимая рука с пером».
 * Строки — волнистые SVG-траектории, которые дорисовываются слева направо
 * (stroke-dashoffset), перо движется точно по той же кривой через CSS
 * motion path (offset-path) и разворачивается по касательной (offset-rotate: auto).
 * В конце — вспышка «готово», затем цикл повторяется.
 * Всё на CSS-анимациях (см. keyframes write-line-N / pen-move-N в index.css).
 */

const CARD_W = 320

const lines: { w: number; d: string; anim: 1 | 2 | 3 | 4 }[] = [
  {
    w: 264,
    anim: 1,
    d: 'M0.0,8.0 Q8.0,11.18 12.0,9.25 Q16.0,7.33 20.0,6.14 Q24.0,4.96 28.0,7.13 Q32.0,9.3 36.0,10.04 Q40.0,10.77 44.0,8.45 Q48.0,6.12 52.0,5.87 Q56.0,5.62 60.0,8.0 Q64.0,10.38 68.0,10.13 Q72.0,9.88 76.0,7.56 Q80.0,5.23 84.0,5.96 Q88.0,6.7 92.0,8.87 Q96.0,11.04 100.0,9.86 Q104.0,8.67 108.0,6.75 Q112.0,4.82 116.0,6.41 Q120.0,8.0 124.0,9.59 Q128.0,11.18 132.0,9.25 Q136.0,7.33 140.0,6.14 Q144.0,4.96 148.0,7.13 Q152.0,9.3 156.0,10.04 Q160.0,10.77 164.0,8.45 Q168.0,6.12 172.0,5.87 Q176.0,5.62 180.0,8.0 Q184.0,10.38 188.0,10.13 Q192.0,9.88 196.0,7.56 Q200.0,5.23 204.0,5.96 Q208.0,6.7 212.0,8.87 Q216.0,11.04 220.0,9.86 Q224.0,8.67 228.0,6.75 Q232.0,4.82 236.0,6.41 Q240.0,8.0 244.0,9.59 Q248.0,11.18 252.0,9.25 Q256.0,7.33 260.0,6.14 L264.0,4.96',
  },
  {
    w: 211,
    anim: 2,
    d: 'M0.0,8.0 Q8.0,11.18 12.0,9.25 Q16.0,7.33 20.0,6.14 Q24.0,4.96 28.0,7.13 Q32.0,9.3 36.0,10.04 Q40.0,10.77 44.0,8.45 Q48.0,6.12 52.0,5.87 Q56.0,5.62 60.0,8.0 Q64.0,10.38 68.0,10.13 Q72.0,9.88 76.0,7.56 Q80.0,5.23 84.0,5.96 Q88.0,6.7 92.0,8.87 Q96.0,11.04 100.0,9.86 Q104.0,8.67 108.0,6.75 Q112.0,4.82 116.0,6.41 Q120.0,8.0 124.0,9.59 Q128.0,11.18 132.0,9.25 Q136.0,7.33 140.0,6.14 Q144.0,4.96 148.0,7.13 Q152.0,9.3 156.0,10.04 Q160.0,10.77 164.0,8.45 Q168.0,6.12 172.0,5.87 Q176.0,5.62 180.0,8.0 Q184.0,10.38 188.0,10.13 Q192.0,9.88 196.0,7.56 Q200.0,5.23 204.0,5.96 Q208.0,6.7 209.5,7.69 L211,8.67',
  },
  {
    w: 238,
    anim: 3,
    d: 'M0.0,8.0 Q8.0,11.18 12.0,9.25 Q16.0,7.33 20.0,6.14 Q24.0,4.96 28.0,7.13 Q32.0,9.3 36.0,10.04 Q40.0,10.77 44.0,8.45 Q48.0,6.12 52.0,5.87 Q56.0,5.62 60.0,8.0 Q64.0,10.38 68.0,10.13 Q72.0,9.88 76.0,7.56 Q80.0,5.23 84.0,5.96 Q88.0,6.7 92.0,8.87 Q96.0,11.04 100.0,9.86 Q104.0,8.67 108.0,6.75 Q112.0,4.82 116.0,6.41 Q120.0,8.0 124.0,9.59 Q128.0,11.18 132.0,9.25 Q136.0,7.33 140.0,6.14 Q144.0,4.96 148.0,7.13 Q152.0,9.3 156.0,10.04 Q160.0,10.77 164.0,8.45 Q168.0,6.12 172.0,5.87 Q176.0,5.62 180.0,8.0 Q184.0,10.38 188.0,10.13 Q192.0,9.88 196.0,7.56 Q200.0,5.23 204.0,5.96 Q208.0,6.7 212.0,8.87 Q216.0,11.04 220.0,9.86 Q224.0,8.67 228.0,6.75 Q232.0,4.82 235.0,5.76 L238,6.7',
  },
  {
    w: 150,
    anim: 4,
    d: 'M0.0,8.0 Q8.0,11.18 12.0,9.25 Q16.0,7.33 20.0,6.14 Q24.0,4.96 28.0,7.13 Q32.0,9.3 36.0,10.04 Q40.0,10.77 44.0,8.45 Q48.0,6.12 52.0,5.87 Q56.0,5.62 60.0,8.0 Q64.0,10.38 68.0,10.13 Q72.0,9.88 76.0,7.56 Q80.0,5.23 84.0,5.96 Q88.0,6.7 92.0,8.87 Q96.0,11.04 100.0,9.86 Q104.0,8.67 108.0,6.75 Q112.0,4.82 116.0,6.41 Q120.0,8.0 124.0,9.59 Q128.0,11.18 132.0,9.25 Q136.0,7.33 140.0,6.14 Q144.0,4.96 147.0,6.48 L150,8.0',
  },
]

export function WritingDocument({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'relative mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-soft backdrop-blur-sm',
        className
      )}
      style={{ width: CARD_W }}
    >
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="wd-ink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#F3D98B" />
            <stop offset="0.5" stopColor="#E2C581" />
            <stop offset="1" stopColor="#D4A94C" />
          </linearGradient>
        </defs>
      </svg>

      <CheckCircle2
        size={20}
        className="absolute right-5 top-5 text-gold-400 [animation:write-done_6s_ease-in-out_infinite]"
      />

      <div className="mb-7 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
          <ScrollText size={20} />
        </span>
        <div className="h-2.5 w-24 rounded-full bg-white/10" />
      </div>

      <div className="flex flex-col gap-5">
        {lines.map((line) => (
          <div key={line.anim} className="relative h-4" style={{ width: line.w }}>
            <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-white/[0.07]" />

            <svg width={line.w} height={16} viewBox={`0 0 ${line.w} 16`} className="absolute left-0 top-0 overflow-visible">
              <path
                d={line.d}
                fill="none"
                stroke="url(#wd-ink)"
                strokeWidth={2.6}
                strokeLinecap="round"
                pathLength={100}
                style={
                  {
                    strokeDasharray: 100,
                    strokeDashoffset: 100,
                    filter: 'drop-shadow(0 0 3px rgba(212,169,76,0.55))',
                    animation: `write-line-${line.anim} 6s ease-in-out infinite`,
                  } as CSSProperties
                }
              />
            </svg>

            <div
              className="pointer-events-none absolute left-0 top-0 h-7 w-7 -translate-x-1/2 -translate-y-1/2"
              style={
                {
                  offsetPath: `path('${line.d}')`,
                  offsetRotate: 'auto',
                  offsetDistance: '0%',
                  animation: `pen-move-${line.anim} 6s ease-in-out infinite`,
                } as CSSProperties
              }
            >
              <PenNibIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PenNibIcon() {
  return (
    <svg viewBox="0 0 28 28" className="h-full w-full drop-shadow-[0_0_7px_rgba(212,169,76,0.8)]">
      <defs>
        <linearGradient id="wd-pen-body" x1="2" y1="20" x2="24" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B9862A" />
          <stop offset="0.5" stopColor="#F3D98B" />
          <stop offset="1" stopColor="#D4A94C" />
        </linearGradient>
        <linearGradient id="wd-pen-nib" x1="18" y1="14" x2="26" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A6A1F" />
          <stop offset="1" stopColor="#E8C66C" />
        </linearGradient>
      </defs>

      <path d="M3 22 L17 10.5 L19.5 13 L5.5 24.5 Z" fill="url(#wd-pen-body)" stroke="#0d1023" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M9.3 16.9 L12.6 14.1 L14.5 16.3 L11.2 19.1 Z" fill="#0d1023" opacity="0.35" />
      <path
        d="M15.5 11.8 L25.5 3.2 C26.6 2.3 28 3.6 27 4.7 L18.4 14.2 Z"
        fill="url(#wd-pen-nib)"
        stroke="#0d1023"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <line x1="20.5" y1="10.5" x2="24.5" y2="6" stroke="#0d1023" strokeWidth="0.5" strokeLinecap="round" />
      <circle cx="25.7" cy="4.6" r="2.2" fill="#F3D98B" opacity="0.35" />
      <circle cx="25.7" cy="4.6" r="1.1" fill="#fff8e6" opacity="0.9" />
      <circle cx="3.6" cy="22.4" r="1.4" fill="#0d1023" opacity="0.25" />
    </svg>
  )
}
