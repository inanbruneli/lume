import type { ComponentProps } from 'react'
import type { ColorLevel } from '@lume/shared'
import { cn } from '@/lib/utils'

export const LEVEL_CLASS: Record<ColorLevel, string> = {
  0: 'bg-level-0',
  1: 'bg-level-1',
  2: 'bg-level-2',
  3: 'bg-level-3',
  4: 'bg-level-4',
}

interface DayCellProps extends Omit<ComponentProps<'button'>, 'color'> {
  color: ColorLevel
  selected?: boolean
}

export function DayCell({ color, selected, className, ...props }: DayCellProps) {
  return (
    <button
      type="button"
      className={cn(
        'size-3 rounded-[3px] ring-1 ring-inset ring-white/5',
        'transition-[transform,box-shadow,background-color] duration-150',
        'hover:scale-140 hover:ring-white/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected && 'scale-140 ring-2 ring-primary',
        LEVEL_CLASS[color],
        className
      )}
      {...props}
    />
  )
}

export function EmptyCell() {
  return <div className="size-3 rounded-[3px] ring-1 ring-inset ring-white/5" />
}
