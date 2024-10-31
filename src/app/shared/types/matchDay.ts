import {FixtureDto} from "./leaderBoardDetails";

export interface MatchDay {
  matchdayId: number
  competitionId: any
  communityId: any
  matchdayName: string
  matchRoundsDtos: any
  currentTab: boolean
  isActive: boolean
  noOfEvents: number | null
  sortOrder: number | null
  fixtures?:FixtureDto[]
  winner?: boolean
  startTime?:number|null
}
