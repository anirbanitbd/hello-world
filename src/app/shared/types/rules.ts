
export interface Rules {
  gameRules: GameRules
  pointRules: PointRule[]
  winnerRules: WinRule
}

export interface GameRules {
  gameRuleId: number
  communityId: number
  visibility: boolean
  matchWinner: boolean
  odds: boolean
}

export interface PointRule {
  pointRuleId: number
  communityId: number
  rulesType: string
  tableData?: PointRule[]
  rulesSubType: string
  points: any
  tendency: number
  goalDifference: number
  result: number
  active: boolean
  awayWin: number
  mpoints: number
}
interface WinRule {
  id: number
  communityId: number
  winnerRuleMasterId: number
  winnerRule: string
  winnerRuleDescription: string
  winnerRuleDistribution: string
  isDefault: boolean
}
