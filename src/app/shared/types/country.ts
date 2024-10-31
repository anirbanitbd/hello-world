export interface Country {
  countryId: number
  actualCountryId: number
  name: string
  officialName?: string
  fifaName?: string
  imagePath?: string
  isSelected?: boolean
  continentId?: number
  continentName: string
  continentCode?: string
}
