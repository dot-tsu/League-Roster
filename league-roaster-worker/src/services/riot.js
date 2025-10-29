import MasteryProvider from '../providers/riot-api/mastery.js'
import MatchProvider from '../providers/riot-api/match.js'
import SummonerProvider from '../providers/riot-api/summoner.js'

export default class RiotService {
  static init() {
    this.summonerProvider = new SummonerProvider()
    this.matchProvider = new MatchProvider()
    this.masteryProvider = new MasteryProvider()
  }

  static async getUserBasicData(gameName, tagLine, region) {
    const account = await this.summonerProvider.getSummonerByRiotId(gameName, tagLine, region)
    const summoner = await this.summonerProvider.getSummonerByPuuid(account.puuid, region)
    const matchIds = await this.matchProvider.getMatchIdsByPuuid(account.puuid, region)

    const matchStats = []
    for (const matchId of matchIds) {
      try {
        const matchData = await this.matchProvider.getMatchById(matchId, region)
        const roastableStats = this.matchProvider.extractRoastableStats(matchData, account.puuid)
        matchStats.push(roastableStats)
      }
      catch (error) {
        console.error(`[RiotService] Error fetching match ${matchId}:`, error.message)
      }
    }

    const averageStats = this.matchProvider.calculateAverageStats(matchStats)
    const masteryData = await this.masteryProvider.getTopChampionMasteries(account.puuid, region, 3)
    const roastableMasteries = this.masteryProvider.extractRoastableMasteryData(masteryData)

    return {
      account: {
        puuid: account.puuid,
        gameName: account.gameName,
        tagLine: account.tagLine,
      },
      summoner: {
        id: summoner.id,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
      },
      averageStats,
      topChampionMasteries: roastableMasteries,
    }
  }
}
