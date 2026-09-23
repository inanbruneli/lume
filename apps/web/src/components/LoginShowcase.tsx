import type { ColorLevel } from '@lume/shared'
import { Timer } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'
import { LEVEL_CLASS } from './DayCell'

const WEEKS = 18
const DAYS_PER_WEEK = 7

function sampleLevel(week: number, day: number): ColorLevel {
  const seed = Math.sin((week * DAYS_PER_WEEK + day) * 12.9898) * 43758.5453
  const noise = seed - Math.floor(seed)
  const trend = (week / WEEKS) * 2.4
  return Math.min(4, Math.floor(noise * 2.6 + trend)) as ColorLevel
}

const SAMPLE_WEEKS = Array.from({ length: WEEKS }, (_, week) =>
  Array.from({ length: DAYS_PER_WEEK }, (_, day) => sampleLevel(week, day))
)

export function LoginShowcase() {
  const { t, formatMinutes } = useTranslation()

  return (
    <aside className="relative hidden overflow-hidden rounded-[1.75rem] bg-[#140f2b] ring-1 ring-inset ring-white/8 lg:block">
      <div className="login-aurora absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0b10]/85 via-transparent to-transparent" />

      <div className="absolute inset-x-10 bottom-10 animate-rise rounded-2xl bg-white/6 p-6 ring-1 ring-inset ring-white/14 backdrop-blur-xl [animation-delay:240ms]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-medium text-white">{t('showcaseTitle')}</p>
            <p className="mt-1 max-w-xs text-sm text-white/65">{t('showcaseBody')}</p>
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-xs text-white/85 ring-1 ring-inset ring-white/12">
            <Timer className="size-3.5 text-brand-soft" />
            {t('namePlaceholder')} · {formatMinutes(42)}
          </span>
        </div>

        <div className="flex gap-1">
          {SAMPLE_WEEKS.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-1 flex-col gap-1">
              {week.map((level, dayIndex) => (
                <span
                  key={dayIndex}
                  className={cn('aspect-square rounded-[3px]', LEVEL_CLASS[level])}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
