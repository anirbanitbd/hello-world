export interface PredictionMatchDetails {
  fixtureId: number
  date: any
  dateString: string
  home: string
  homeId: number
  homeScore: number
  away: string
  awayId: number
  awayScore: number
  result: string
  round: string
  dateTimestamp: number
  predictedHomeScore?: number
  predictedAwayScore?: number
  predictionId?: number
  isSelected?: boolean
  awayLogo?: string
  homeLogo?: string
  drawOdd?:string
  awayWinOdd?:string
  homeWinOdd?:string
  bonusAnswerCount?:number
  bonusQuestionCount?:number
}
