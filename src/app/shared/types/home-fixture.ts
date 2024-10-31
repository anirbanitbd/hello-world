export interface HomeFixtureBody {
  competitionName: string
  data: Fixture[]
  logo: string
  competitionId: number
}
export interface Fixture {
  competitionLogo?: string
  competitionName: string
  fixtureId: number
  leagueId: number
  dateTimestamp: number
  dateString: string
  elapsed: number
  home: string
  homeCode?: string
  homeId: number
  homeLogo: string
  homeScore?: number
  away: string
  awayCode?: string
  awayId: number
  awayLogo: string
  awayScore?: number
  result: string
  round: string
  predictedHomeScore: any
  predictedAwayScore: any
  predictionId: any
  homeWinOdd?: string
  awayWinOdd?: string
  drawOdd?: string
  matchDayId: any
  roundType: string
  bonusAnswerCount: any
  pointRule: any
  isLive: boolean
  competitionId: number
}
