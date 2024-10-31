export interface FixtureEvent {
  temaId: number
  teamName: string
  minute: number
  extraMinute?: number
  playerName: string
  relatedPlayerName?: string
  type: string
}
