export interface CompetitionList {
  id?: number
  name: string
  type?: string
  logo?: string
  country?: string
  flag?: string
  year: number
  start: string
  end: string
  current: boolean
  standings?: any
  competitionId?: number
}
