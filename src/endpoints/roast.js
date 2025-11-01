import AIService from '../services/ai.js'
import RiotService from '../services/riot.js'

async function roastEndpoint(context) {
  try {
    const { tag, region, language = 'en' } = await context.req.json()

    if (!tag || !region) {
      return context.json({ error: 'Missing required fields: tag, region' }, 400)
    }

    if (!tag.includes('#')) {
      return context.json({ error: 'Invalid format. Use: "summoner name #tag"' }, 400)
    }

    const [gameName, tagLine] = tag.split('#')

    const userData = await RiotService.getUserBasicData(gameName, tagLine, region)
    const roast = await AIService.roastPlayer(userData, language)

    return context.json({
      player: `${userData.account.gameName}#${userData.account.tagLine}`,
      roast,
    })
  }
  catch (error) {
    return context.json({ error: error.message }, 400)
  }
}

export default roastEndpoint
