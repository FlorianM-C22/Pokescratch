export interface PlayerScore {
  name: string
  score: number
  date: string
}

export interface GameState {
  playerName: string
  currentScore: number
  timeLeft: number
  isGameOver: boolean
}
