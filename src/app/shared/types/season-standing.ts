export interface SeasonStanding {
  data: StandingData[] | null
  hasGrouping: boolean
}
export interface StandingData {
  seasonId: any
  teamId: number
  teamName: string
  position: number
  group: string
  points: number
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  gamesDraw: number
  goalsFor: number
  goalsAgainst: number
  goalsDiff: number
}
export interface SeasonStandingGroupedData {
  groupName: string;
  data: StandingData[];
}
