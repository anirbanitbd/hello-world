export enum QuestionType {
  Text = 'text',
  Dropdown = 'dropdown'
}
export interface ActiveOdds {
  questionId?: number
  question: string
  oddsValues?: OddsValue[]
  type?: QuestionType
  fixtureId: number
  value?:any
  valueId?:number
  bonusId?:number
  selectedValueId?: number
  bonusUserAnswerId?: number
  communityId?: number
}
export interface OddsValue {
  valueId: number
  value: number
  label: string
}
