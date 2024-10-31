export interface BonusTableData {
  questionsTable: questionsTableDto[]
  usersPointTable: UserPointTableDto[]
}

export interface questionsTableDto {
  questionId: number
  question: string
  questionShortCode: string
  isMulti: boolean
  result: any
  pointRule?: any
  currentResultIndex: number
}

export interface UserPointTableDto {
  playerId: number | null
  playerName: string
  bonusAnswersDto: BonusAnswerDto[]
  points: number
  bonusPoints: number
  totalPoints: number
  average: number
}

export interface BonusAnswerDto {
  questionId: number
  questionShortCode: string | null
  isMulti: boolean
  predictedAnswer: any
  isCorrect: boolean
  earnedPoints: number
  currentResultIndex: number
}
