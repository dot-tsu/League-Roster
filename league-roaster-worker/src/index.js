import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { AIService } from './services/ai.js'
import { ConfigService } from './services/config.js'

const app = new Hono()
app.use('*', cors())

app.onError((error, context) => {
  console.error(error)
  return context.json({ error: error.message }, 500)
})

app.use('*', async (context, next) => {
  ConfigService.init(context)
  AIService.init()
  await next()
})

export default app
