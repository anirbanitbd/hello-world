export interface UserMatchDayStat {
  predictionDtos: UserStatPredictionDto[]
  matchdayPoints?: number
  totalPoints: any
  matchdayWins?: number
  playerName: string
}

export interface UserStatPredictionDto {
  userId: number
  playerName: any
  teamName: string
  result?: string
  prediction: any
  points: any
  win: any
  bonusDetails: BonusDetail[]
  bonusPoints: any
  pbonus?: any
}

export interface BonusDetail {
  bonusId: number
  questionId: any
  question?: string
  oddsValues: any
  type: any
  fixtureId: number
  valueId?: number
  value: any
  userAnswer?: string
  userAnswerId?: number
  actualAnswer?: string
  scoredPoint: any
}

