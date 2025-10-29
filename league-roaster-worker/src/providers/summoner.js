import RiotApiClient from '../lib/riot-api-client.js'
import RegionHelper from '../utils/region-helper.js'

export default class SummonerProvider extends RiotApiClient {
  async getSummonerByRiotId(gameName, tagLine, regionName) {
    const regionBase = RegionHelper.getRegionByServer(regionName)
    const url = `https://${regionBase}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`

    return this.makeRequest(url)
  }

  async getSummonerByPuuid(puuid, regionName) {
    const serverUrl = RegionHelper.getServerUrl(regionName)
    const url = `https://${serverUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`

    return this.makeRequest(url)
  }
}
