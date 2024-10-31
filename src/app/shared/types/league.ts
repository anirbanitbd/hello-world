export interface League {
  competitionId: number
  id: number
  name: string
  type: string
  logo: string
  countryId: number
  countryName: string
  countryFlag: string
  year: number
  start: string
  end: string
  current: boolean
  standings: any
  isLogo: boolean
}
