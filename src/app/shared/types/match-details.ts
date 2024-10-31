export interface MatchDetails {
  teamHomeName: string
  teamHomeScore: number
  teamHomeLogo: string
  teamAwayName: string
  teamAwayLogo: string
  teamAwayScore: number
  stadium: string
  homeGoalDetails: GoalDetails[]
  awayGoalDetails: GoalDetails[]
  homeCardDetails: CardDetails[]
  awayCardDetails: CardDetails[]
  homeSwitchDetail: SwitchDetail[]
  awaySwitchDetail: SwitchDetail[]
  lineupHome: Lineup[]
  lineupAway: Lineup[]
  substituteHome: Substitute[]
  substituteAway: Substitute[]
  awayPenaltyGoalDetails: PenaltyGoalDetails[]
  homePenaltyGoalDetails: PenaltyGoalDetails[]
  teamHomePenaltyScore?: number
  teamAwayPenaltyScore?: number
  homeManager: string
  awayManager: string
  eventDate: string
  eventTimestamp: number
  referee?: string
  round: string
  fixtureIds: number[]
  status?: string
  statusShort?: string
  elapsed?: number
  pointRule?: string
  competitionName?: string
  weatherReport:WeatherReport
  awayTeamId: number
  homeTeamId: number
}

export interface WeatherReport {
  weather?: string
  temperatureMetric?: string
  temperature?: number
  clouds?: string
  windSpeed?: number
  humidity?: string
}

export interface GoalDetails {
  playerName: string
  cardType: string
  cardDetail: any
  teamName: string
  time: number
  goal: string
  mergedTime: number[]
}

export interface CardDetails {
  playerName: string
  cardType: string
  cardDetail: string
  teamName: string
  time: number
  isHome?: boolean
}

export interface SwitchDetail {
  playerName: string
  cardType: string
  cardDetail: string
  teamName: string
  goal?: string
  switchPlayerName: string
  time: number
  jerseyNumber: number
}
export interface PenaltyGoalDetails {
  playerName: string
  cardType: string
  cardDetail: string
  teamName: string
  goal?: string
  switchPlayerName: string
  time: number
  jerseyNumber: number
}

export interface Lineup {
  playerName: string
  playerNumber: number
}


export interface Substitute {
  playerName: string
  playerNumber: number
}
