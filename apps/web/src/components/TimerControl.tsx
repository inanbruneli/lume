import { useCallback, useEffect, useState } from 'react'
import { PauseCircle, PlayCircle, Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/i18n'
import { cn } from '@/lib/utils'

interface TimerControlProps {
  onFinish: (minutes: number) => void
}

export function TimerControl({ onFinish }: TimerControlProps) {
  const { t } = useTranslation()
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  const isPaused = !isRunning && elapsedMs > 0

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
    const seconds = String(totalSeconds % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  useEffect(() => {
    if (!isRunning || startTime === null) return

    const update = () => setElapsedMs(Date.now() - startTime)
    update()
    const interval: ReturnType<typeof setInterval> = setInterval(update, 100)
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const handleStart = useCallback(() => {
    setStartTime(Date.now() - elapsedMs)
    setIsRunning(true)
  }, [elapsedMs])

  const handlePause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setStartTime(null)
    setElapsedMs(0)
  }, [])

  const handleFinish = useCallback(() => {
    setIsRunning(false)
    onFinish(Math.floor(elapsedMs / 60000))
    handleReset()
  }, [elapsedMs, onFinish, handleReset])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <Timer
          className={cn(
            'size-6 transition-colors',
            isRunning ? 'text-brand-soft' : 'text-muted-foreground'
          )}
        />
        <span
          className={cn(
            'font-mono text-xl tabular-nums transition-colors',
            elapsedMs > 0 ? 'text-brand' : 'text-muted-foreground'
          )}
        >
          {formatTime(elapsedMs)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isRunning ? (
          <Button variant="ghost" size="icon" aria-label={t('pause')} onClick={handlePause}>
            <PauseCircle className="size-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={isPaused ? t('resume') : t('start')}
            onClick={handleStart}
          >
            <PlayCircle className="size-5" />
          </Button>
        )}

        {isPaused ? (
          <Button variant="ghost" size="icon" aria-label={t('reset')} onClick={handleReset}>
            <X className="size-5" />
          </Button>
        ) : null}

        {isRunning || isPaused ? (
          <Button variant="outline" size="sm" onClick={handleFinish}>
            {t('finish')}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
