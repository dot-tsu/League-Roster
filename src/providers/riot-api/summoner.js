import RiotApiClient from './index.js'
import { getRegionByServer, getServerUrl } from './utils/region.js'

export default class SummonerProvider extends RiotApiClient {
  async getSummonerByRiotId(gameName, tagLine, regionName) {
    const regionBase = getRegionByServer(regionName)
    const url = `https://${regionBase}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`

    return this.makeRequest(url)
  }

  async getSummonerByPuuid(puuid, regionName) {
    const serverUrl = getServerUrl(regionName)
    const url = `https://${serverUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`

    return this.makeRequest(url)
  }
}
