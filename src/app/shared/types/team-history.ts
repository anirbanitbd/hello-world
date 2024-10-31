export interface TeamHistory {
  homeResult: HistoryResult[]
  home: HistoryResult[]
  away: HistoryResult[]
  awayResult: HistoryResult[]
  headToHead: HistoryResult[]
}

export interface HistoryResult {
  leagueId: number
  leagueName: string
  seasonId: number
  seasonName: string
  country: string
  actualFixtureId: number
  startingAt: string
  startingAtTimestamp: number
  status: string
  shortStatus: string
  homeTeamId: number
  homeTeamName: string
  homeTeamLogo: string
  homeTeamGoals: number
  homeTeamWinner: boolean
  awayTeamId: number
  awayTeamName: string
  awayTeamLogo: string
  awayTeamGoals: number
  awayTeamWinner: boolean
}
