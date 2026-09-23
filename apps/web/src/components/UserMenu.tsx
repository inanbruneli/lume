import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslation } from '@/i18n'
import { signOut } from '@/store/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectAuthUser } from '@/store/selectors'

export function UserMenu() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const user = useAppSelector(selectAuthUser)
  const [pictureFailed, setPictureFailed] = useState(false)

  if (!user) return null

  const initial = (user.name ?? user.email).charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            className="grid size-8 place-items-center overflow-hidden rounded-full bg-primary/12 text-xs font-medium text-brand-soft ring-1 ring-inset ring-primary/25 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {user.picture && !pictureFailed ? (
              <img
                src={user.picture}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setPictureFailed(true)}
                className="size-full object-cover"
              />
            ) : (
              initial
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>{t('signedInAs', { email: user.email })}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t('signOut')}
            onClick={() => dispatch(signOut())}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('signOut')}</TooltipContent>
      </Tooltip>
    </div>
  )
}
