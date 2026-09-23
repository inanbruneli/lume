import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeUserData, type UserData, type UserDataStore } from './userDataStore.js'

type DbShape = Record<string, UserData>

interface StoredDb {
  users: DbShape
  unclaimed: UserData | null
}

const here = dirname(fileURLToPath(import.meta.url))
const DB_PATH = resolve(here, '../../data/db.json')

function isUnclaimedShape(value: Record<string, unknown>): boolean {
  return Array.isArray(value.habits) || Array.isArray(value.entries)
}

function storedData(users: DbShape, owner: string): UserData {
  return normalizeUserData(Object.hasOwn(users, owner) ? users[owner] : undefined)
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

export function createJsonStore(): UserDataStore {
  let writeQueue: Promise<unknown> = Promise.resolve()

  const store: UserDataStore = {
    async read(owner) {
      const stored = await readStoredDb()
      if (stored.unclaimed) return store.mutate(owner, (data) => data)
      return storedData(stored.users, owner)
    },

    mutate(owner, mutator) {
      const next = writeQueue.then(async () => {
        const stored = await readStoredDb()
        const users = stored.unclaimed ? { [owner]: stored.unclaimed } : stored.users
        const data = storedData(users, owner)
        users[owner] = data
        const result = await mutator(data)
        await writeDb(users)
        return result
      })
      writeQueue = next.catch(() => undefined)
      return next
    }
  }

  return store
}
