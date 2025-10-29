import CHAMPION_ID_TO_NAME from '../constants/champions.js'
import RiotApiClient from '../lib/riot-api-client.js'
import RegionHelper from '../utils/region-helper.js'

export default class MasteryProvider extends RiotApiClient {
  async getTopChampionMasteries(puuid, regionName, count = 3) {
    const serverUrl = RegionHelper.getServerUrl(regionName)
    const url = `https://${serverUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`

    return this.makeRequest(url)
  }

  extractRoastableMasteryData(masteryData) {
    if (!masteryData || masteryData.length === 0) {
      return []
    }

    return masteryData.map((mastery, index) => ({
      rank: index + 1,
      championName: CHAMPION_ID_TO_NAME[mastery.championId],
      championLevel: mastery.championLevel,
      championPoints: mastery.championPoints,
      daysSinceLastPlayed: Math.floor((Date.now() - mastery.lastPlayTime) / (1000 * 60 * 60 * 24)),
      dedication: this.categorizeDedication(mastery.championPoints, mastery.championLevel),
      recency: this.categorizeRecency(mastery.lastPlayTime),
    }))
  }

  categorizeDedication(points, level) {
    if (points > 100000)
      return 'obsessed'
    if (level === 7)
      return 'dedicated'
    if (level >= 5)
      return 'committed'
    if (level >= 3)
      return 'casual'
    return 'beginner'
  }

  categorizeRecency(lastPlayTime) {
    const daysSince = Math.floor((Date.now() - lastPlayTime) / (1000 * 60 * 60 * 24))
    if (daysSince <= 7)
      return 'recent'
    if (daysSince <= 30)
      return 'occasional'
    if (daysSince <= 90)
      return 'rusty'
    return 'abandoned'
  }
}
