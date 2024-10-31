export interface seasonStandingBody {
  data: seasonStanding[]
  hasGrouping: boolean
}

export interface seasonStanding {
  seasonId?: any
  teamId?: number
  teamName?: string
  position?: number
  group?: string
  points?: number
  gamesPlayed?: number
  gamesWon?: number
  gamesLost?: number
  gamesDraw?: number
  goalsFor?: number
  goalsAgainst?: number
  goalsDiff?: number
}
