import { createApp } from './app.js'
import { loadAuthConfig } from './config.js'

const PORT = Number(process.env.PORT ?? 3001)

createApp(loadAuthConfig()).listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
