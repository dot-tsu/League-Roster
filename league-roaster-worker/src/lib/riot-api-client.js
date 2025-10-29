import ConfigService from '../services/config.js'

export default class RiotApiClient {
  constructor() {
    this.apiKey = ConfigService.get('RIOT_API_KEY')
  }

  async makeRequest(url) {
    const response = await fetch(url, {
      headers: {
        'X-Riot-Token': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Riot API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
