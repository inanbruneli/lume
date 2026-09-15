import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Habit, HabitEntry } from '@lume/shared'

export interface DbShape {
  habits: Habit[]
  entries: HabitEntry[]
}

const here = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(here, '../../data/db.json')

const EMPTY: DbShape = { habits: [], entries: [] }

let writeQueue: Promise<unknown> = Promise.resolve()

export async function readDb(): Promise<DbShape> {
  try {
    const raw = await readFile(DB_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<DbShape>
    return {
      habits: parsed.habits ?? [],
      entries: parsed.entries ?? []
    }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return { ...EMPTY }
    throw err
  }
}

async function writeDb(db: DbShape): Promise<void> {
  await mkdir(dirname(DB_PATH), { recursive: true })
  const tmp = `${DB_PATH}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
  await rename(tmp, DB_PATH)
}

export function mutateDb<T>(mutator: (db: DbShape) => T | Promise<T>): Promise<T> {
  const next = writeQueue.then(async () => {
    const db = await readDb()
    const result = await mutator(db)
    await writeDb(db)
    return result
  })
  writeQueue = next.catch(() => undefined)
  return next
}
