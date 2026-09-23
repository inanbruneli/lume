import { useEffect } from 'react'
import { Flame, LoaderCircle } from 'lucide-react'
import { useTranslation } from '@/i18n'
import { loadGoogleIdentity } from '@/lib/google'
import { signInWithGoogle } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAuthError, selectAuthStatus } from '@/store/selectors'
import { GoogleIcon } from './GoogleIcon'
import { LanguageToggle } from './LanguageToggle'
import { LoginShowcase } from './LoginShowcase'

export function LoginPage() {
  const dispatch = useAppDispatch()
  const { t, translateError } = useTranslation()
  const signingIn = useAppSelector(selectAuthStatus) === 'signingIn'
  const error = useAppSelector(selectAuthError)

  useEffect(() => {
    loadGoogleIdentity().catch(() => undefined)
  }, [])

  return (
    <div className="grid min-h-screen gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="flex flex-col px-2 py-2 sm:px-6">
        <div className="flex animate-rise items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/12 ring-1 ring-inset ring-primary/25">
              <Flame className="size-4.5 text-brand-soft" />
            </span>
            <span className="text-gradient text-xl font-semibold tracking-tight">
              {t('appName')}
            </span>
          </div>
          <LanguageToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-sm">
            <h1 className="animate-rise text-5xl font-semibold tracking-tight text-foreground [animation-delay:60ms] sm:text-6xl">
              {t('loginTitle')}
            </h1>
            <p className="mt-4 animate-rise text-base text-muted-foreground [animation-delay:120ms]">
              {t('loginSubtitle')}
            </p>

            <button
              type="button"
              onClick={() => dispatch(signInWithGoogle())}
              disabled={signingIn}
              className="mt-10 flex h-13 w-full animate-rise items-center justify-center gap-3 rounded-2xl border bg-card/70 text-[0.95rem] font-medium text-foreground shadow-[inset_0_1px_0_0_--alpha(#fff/5%)] transition-colors outline-none [animation-delay:180ms] hover:border-primary/35 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-80"
            >
              {signingIn ? (
                <LoaderCircle className="size-5 animate-spin text-brand-soft" />
              ) : (
                <GoogleIcon className="size-5" />
              )}
              {signingIn ? t('signingIn') : t('continueWithGoogle')}
            </button>

            {error ? (
              <p role="alert" className="mt-4 text-center text-sm text-destructive">
                {translateError(error, 'errorGoogleSignIn')}
              </p>
            ) : null}

            <p className="mt-6 animate-rise text-center text-sm text-muted-foreground [animation-delay:240ms]">
              {t('loginFootnote')}
            </p>
          </div>
        </div>

        <p className="animate-rise text-xs text-muted-foreground/70 [animation-delay:300ms]">
          {t('appName')} · {t('tagline')}
        </p>
      </section>

      <LoginShowcase />
    </div>
  )
}
