import { Hono } from 'hono'
import { cors } from 'hono/cors'
import frontend from './endpoints/frontend.js'
import roast from './endpoints/roast.js'
import AIService from './services/ai.js'
import ConfigService from './services/config.js'
import RiotService from './services/riot.js'

const app = new Hono()
app.use('*', cors())

app.onError((error, context) => {
  console.error(error)
  return context.json({ error: error.message }, 500)
})

app.use('*', async (context, next) => {
  ConfigService.init(context)
  AIService.init()
  RiotService.init()
  await next()
})

app.post('/roast', roast)
app.get('/', frontend)

export default app
