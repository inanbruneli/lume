import { useEffect } from 'react'
import { App } from './App'
import { LoginPage } from './components/LoginPage'
import { useTranslation } from './i18n'
import { restoreSession } from './store/authSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { selectAuthStatus } from './store/selectors'

export function Root() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const status = useAppSelector(selectAuthStatus)

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  if (status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          {t('loading')}
        </div>
      </div>
    )
  }

  return status === 'signedIn' ? <App /> : <LoginPage />
}
