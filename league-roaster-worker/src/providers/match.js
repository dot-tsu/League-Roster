import RiotApiClient from '../lib/riot-api-client.js'
import RegionHelper from '../utils/region-helper.js'

export default class MatchProvider extends RiotApiClient {
  async getMatchIdsByPuuid(puuid, regionName) {
    const regionBase = RegionHelper.getRegionByServer(regionName)
    const url = `https://${regionBase}/lol/match/v5/matches/by-puuid/${puuid}/ids`

    return this.makeRequest(url)
  }

  async getMatchById(matchId, regionName) {
    const regionBase = RegionHelper.getRegionByServer(regionName)
    const url = `https://${regionBase}/lol/match/v5/matches/${matchId}`

    return this.makeRequest(url)
  }

  extractRoastableStats(matchData, puuid) {
    const participant = matchData.info.participants.find(p => p.puuid === puuid)

    return {
      kills: participant.kills,
      deaths: participant.deaths,
      assists: participant.assists,
      kda: participant.deaths === 0 ? participant.kills + participant.assists : (participant.kills + participant.assists) / participant.deaths,
      csPerMinute: (participant.totalMinionsKilled + participant.neutralMinionsKilled) / (matchData.info.gameDuration / 60),
      damagePerMinute: participant.totalDamageDealtToChampions / (matchData.info.gameDuration / 60),
      visionScore: participant.visionScore,
      win: participant.win,
      gameEndedInSurrender: participant.gameEndedInSurrender || participant.gameEndedInEarlySurrender,
      championName: participant.championName,
      teamPosition: participant.teamPosition,
    }
  }

  calculateAverageStats(matchStatsArray) {
    if (!matchStatsArray || matchStatsArray.length === 0) {
      return null
    }

    const championCounts = {}
    const totals = matchStatsArray.reduce((acc, match) => {
      acc.kills += match.kills
      acc.deaths += match.deaths
      acc.assists += match.assists
      acc.csPerMinute += match.csPerMinute
      acc.damagePerMinute += match.damagePerMinute
      acc.visionScore += match.visionScore
      acc.wins += match.win ? 1 : 0
      acc.surrenders += match.gameEndedInSurrender ? 1 : 0
      championCounts[match.championName] = (championCounts[match.championName] || 0) + 1
      return acc
    }, { kills: 0, deaths: 0, assists: 0, csPerMinute: 0, damagePerMinute: 0, visionScore: 0, wins: 0, surrenders: 0 })

    const matchCount = matchStatsArray.length
    const averageKDA = totals.deaths === 0 ? totals.kills + totals.assists : (totals.kills + totals.assists) / totals.deaths
    const mostPlayedChampion = Object.entries(championCounts).sort(([,a], [,b]) => b - a)[0]

    return {
      kills: Math.round((totals.kills / matchCount) * 10) / 10,
      deaths: Math.round((totals.deaths / matchCount) * 10) / 10,
      assists: Math.round((totals.assists / matchCount) * 10) / 10,
      kda: Math.round(averageKDA * 10) / 10,
      csPerMinute: Math.round((totals.csPerMinute / matchCount) * 10) / 10,
      damagePerMinute: Math.round((totals.damagePerMinute / matchCount) * 10) / 10,
      visionScore: Math.round((totals.visionScore / matchCount) * 10) / 10,
      winRate: Math.round((totals.wins / matchCount) * 100),
      surrenderRate: Math.round((totals.surrenders / matchCount) * 100),
      mostPlayedChampion: mostPlayedChampion[0],
    }
  }
}
