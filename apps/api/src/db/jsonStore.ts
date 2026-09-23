import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Habit, HabitEntry } from '@lume/shared'

export interface UserData {
  habits: Habit[]
  entries: HabitEntry[]
}

type DbShape = Record<string, UserData>

interface StoredDb {
  users: DbShape
  unclaimed: UserData | null
}

const here = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(here, '../../data/db.json')

let writeQueue: Promise<unknown> = Promise.resolve()

function normalizeUserData(value: Partial<UserData> | undefined): UserData {
  return {
    habits: value?.habits ?? [],
    entries: value?.entries ?? []
  }
}

function isUnclaimedShape(value: Record<string, unknown>): boolean {
  return Array.isArray(value.habits) || Array.isArray(value.entries)
}

async function readStoredDb(): Promise<StoredDb> {
  try {
    const raw = await readFile(DB_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (isUnclaimedShape(parsed)) {
      return { users: {}, unclaimed: normalizeUserData(parsed as Partial<UserData>) }
    }
    return { users: parsed as DbShape, unclaimed: null }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return { users: {}, unclaimed: null }
    throw err
  }
}

async function writeDb(db: DbShape): Promise<void> {
  await mkdir(dirname(DB_PATH), { recursive: true })
  const tmp = `${DB_PATH}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
  await rename(tmp, DB_PATH)
}

function userBucket(users: DbShape, owner: string): UserData {
  const bucket = normalizeUserData(Object.hasOwn(users, owner) ? users[owner] : undefined)
  users[owner] = bucket
  return bucket
}

export async function readUserData(owner: string): Promise<UserData> {
  const stored = await readStoredDb()
  if (stored.unclaimed) return mutateUserData(owner, (data) => data)
  return normalizeUserData(Object.hasOwn(stored.users, owner) ? stored.users[owner] : undefined)
}

export function mutateUserData<T>(
  owner: string,
  mutator: (data: UserData) => T | Promise<T>
): Promise<T> {
  const next = writeQueue.then(async () => {
    const stored = await readStoredDb()
    const users = stored.unclaimed ? { [owner]: stored.unclaimed } : stored.users
    const result = await mutator(userBucket(users, owner))
    await writeDb(users)
    return result
  })
  writeQueue = next.catch(() => undefined)
  return next
}
