
export interface LeaderBoardDetails {
  fixtureDtos: FixtureDto[]
  userScoreDtos: UserScoreDto[]
}

export interface FixtureDto {
  fixtureId: number
  dateTimestamp: number
  dateString: string
  home: string
  homeCode: any
  homeId: number
  homeLogo: string
  homeScore: number
  away: string
  awayCode: any
  awayId: number
  awayLogo: string
  awayScore: number
  result: string
  round: string
  predictedHomeScore: any
  predictedAwayScore: any
  predictionId: any
  isSelected: boolean
  isSelectDisabled: boolean
  elapsed?: number
  matchDayId?: number
  pointRule?: any
}

export interface UserScoreDto {
  playerId: number|null
  playerName: string|null
  predictionDtos: PredictionDto[]
  points: number|null
  bonus: any
  win: any
  total: any
  status:any
  position?:number
}

export interface PredictionDto {
  predictionId: number|null
  fixtureId: number
  date?: string|null
  homeTeamName: any
  homeTeamId: any
  awayTeamName: any
  awayTeamId: any
  predictedHomeScore?: number|null
  predictedAwayScore?: number|null
  earnedPoints: any
  communityId?: number|null
  communityName: any
  userId: number|null
  communityUserName?: any
}
