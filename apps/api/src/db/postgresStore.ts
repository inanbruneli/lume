import pg from 'pg'
import { normalizeUserData, type UserData, type UserDataStore } from './userDataStore.js'

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS user_data (
    email text PRIMARY KEY,
    data jsonb NOT NULL
  )
`

export function createPostgresStore(connectionString: string): UserDataStore {
  const pool = new pg.Pool({ connectionString, max: 5 })
  pool.on('error', (err) => {
    console.error('Idle database client error', err)
  })

  let schemaReady: Promise<void> | null = null

  function ensureSchema(): Promise<void> {
    schemaReady ??= pool.query(CREATE_TABLE).then(
      () => undefined,
      (err: unknown) => {
        schemaReady = null
        throw err
      }
    )
    return schemaReady
  }

  return {
    async read(owner) {
      await ensureSchema()
      const { rows } = await pool.query<{ data: UserData }>(
        'SELECT data FROM user_data WHERE email = $1',
        [owner]
      )
      return normalizeUserData(rows[0]?.data)
    },

    async mutate(owner, mutator) {
      await ensureSchema()
      const client = await pool.connect()
      try {
        await client.query('BEGIN')
        await client.query(
          'INSERT INTO user_data (email, data) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
          [owner, JSON.stringify(normalizeUserData(undefined))]
        )
        const { rows } = await client.query<{ data: UserData }>(
          'SELECT data FROM user_data WHERE email = $1 FOR UPDATE',
          [owner]
        )
        const data = normalizeUserData(rows[0]?.data)
        const result = await mutator(data)
        await client.query('UPDATE user_data SET data = $2 WHERE email = $1', [
          owner,
          JSON.stringify(data)
        ])
        await client.query('COMMIT')
        return result
      } catch (err) {
        await client.query('ROLLBACK').catch(() => undefined)
        throw err
      } finally {
        client.release()
      }
    }
  }
}
