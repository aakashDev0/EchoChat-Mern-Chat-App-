import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

const app = new Hono()

// Serve static files
app.use('/*', serveStatic({ root: './dist' }))

// Fallback for SPA routing
app.get('*', (c) => {
  return c.html(Bun.file('./dist/index.html'))
})

const port = process.env.PORT || 3000
console.log(`Server running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})