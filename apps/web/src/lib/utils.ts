import { cn } from 'cn'

export { cn }

export function extractError(err: unknown): { code?: string; message?: string } {
  if (typeof err !== 'object' || err === null) return {}
  const record = err as { code?: unknown; message?: unknown }
  return {
    code: typeof record.code === 'string' ? record.code : undefined,
    message: typeof record.message === 'string' && record.message ? record.message : undefined
  }
}
