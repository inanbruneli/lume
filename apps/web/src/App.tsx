import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ContributionGrid } from '@/components/ContributionGrid'
import { CreateHabitDialog } from '@/components/CreateHabitDialog'
import { EmptyState } from '@/components/EmptyState'
import { HabitMenu } from '@/components/HabitMenu'
import { HabitSelect } from '@/components/HabitSelect'
import { Header } from '@/components/Header'
import { LogDayDialog } from '@/components/LogDayDialog'
import { TimerControl } from '@/components/TimerControl'
import { todayIso } from '@/lib/calendar'
import { useTranslation } from '@/i18n'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addSession, habitSelected, loadData } from '@/store/habitsSlice'
import {
  selectError,
  selectHabits,
  selectSelectedHabit,
  selectSelectedHabitId,
  selectStatus
} from '@/store/selectors'

export function App() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const habits = useAppSelector(selectHabits)
  const selectedHabit = useAppSelector(selectSelectedHabit)
  const selectedHabitId = useAppSelector(selectSelectedHabitId)
  const status = useAppSelector(selectStatus)
  const error = useAppSelector(selectError)

  useEffect(() => {
    dispatch(loadData())
  }, [dispatch])

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Header>
          {selectedHabit && (
            <TimerControl
              onFinish={(minutes) => {
                dispatch(
                  addSession({ habitId: selectedHabit.id, date: todayIso(), minutes })
                )
              }}
            />
          )}
        </Header>

        {status === 'loading' ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t('loading')}
          </div>
        ) : status === 'error' ? (
          <Card className="animate-rise border-destructive/40 bg-card/60 [animation-delay:80ms]">
            <CardContent>
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-destructive/12 ring-1 ring-inset ring-destructive/25">
                  <TriangleAlert className="size-5 text-destructive" />
                </span>
                <div className="space-y-1.5">
                  <p className="text-base font-medium">{t('loadErrorTitle')}</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    {error ?? t('loadErrorFallback')} {t('loadErrorHint')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => dispatch(loadData())}>
                  {t('retry')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : habits.length === 0 ? (
          <Card className="animate-rise border-dashed bg-card/60 [animation-delay:80ms]">
            <CardContent>
              <EmptyState />
            </CardContent>
          </Card>
        ) : (
          <div className="animate-rise space-y-4 [animation-delay:80ms]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                <HabitSelect
                  habits={habits}
                  value={selectedHabitId}
                  onChange={(id) => dispatch(habitSelected(id))}
                  className="w-56"
                />
                {selectedHabit ? <HabitMenu habit={selectedHabit} /> : null}
              </div>
              <div className="flex items-center gap-2">
                <LogDayDialog habits={habits} defaultHabitId={selectedHabitId} />
                <CreateHabitDialog />
              </div>
            </div>

            <Card className="bg-card/70 shadow-[inset_0_1px_0_0_--alpha(#fff/6%),0_24px_48px_-32px_#000] backdrop-blur-sm transition-colors duration-300 hover:border-primary/25">
              <CardContent>
                {selectedHabit ? <ContributionGrid habit={selectedHabit} /> : null}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
