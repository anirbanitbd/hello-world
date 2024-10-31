export interface CompetitionBonusDto {
  questionID: number
  question: string
  isMulti: boolean
  answer?:any
  options: BonusOption[]
}

export interface BonusOption {
  id: number
  name: string
  shortcutName?: string
}
