import REGION_URLS from '../constants/regions.js'

export default class RegionHelper {
  static getRegionByServer(server) {
    for (const [, regionData] of Object.entries(REGION_URLS)) {
      if (regionData.servers[server]) {
        return regionData.base
      }
    }
    throw new Error(`Server '${server}' not found in any region`)
  }

  static getServerUrl(regionName) {
    for (const [, regionData] of Object.entries(REGION_URLS)) {
      if (regionData.servers[regionName]) {
        return regionData.servers[regionName]
      }
    }
    throw new Error(`Server '${regionName}' not found in any region`)
  }
}
