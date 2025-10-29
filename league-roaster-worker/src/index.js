import { Hono } from 'hono'
import { cors } from 'hono/cors'
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

// Test endpoint for blue saturday #fever from LAS region
app.get('/test/riot', async (context) => {
  try {
    const userData = await RiotService.getUserBasicData('blue saturday', 'fever', 'las')
    return context.json(userData)
  }
  catch (error) {
    return context.json({ error: error.message }, 400)
  }
})

export default app
