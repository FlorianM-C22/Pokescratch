'use client'

import { useState, useEffect } from 'react'
import { getRandomPokemon } from '@/lib/get_random_pokemon'
import ScratchToReveal from '@/components/ui/scratch-to-reveal'
import LandingComponent from '@/components/ui/landing-component'
import NameInput from '@/components/ui/name-input'
import Scoreboard from '@/components/ui/scoreboard'
import { fuzzyMatch } from '@/lib/utils'
import Image from 'next/image'
import { PlayerScore, GameState } from '@/lib/types'

interface PokemonData {
  name: string
  types: string[]
  type_img: string[]
  image: string
}

const GAME_TIME = 60
const STORAGE_KEY = 'pokescratch_scores'

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    currentScore: 0,
    timeLeft: GAME_TIME,
    isGameOver: false,
  })

  const [showNameInput, setShowNameInput] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [guess, setGuess] = useState('')
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null)

  const [scores, setScores] = useState<PlayerScore[]>([])

  useEffect(() => {
    const savedScores = localStorage.getItem(STORAGE_KEY)
    if (savedScores) {
      setScores(JSON.parse(savedScores))
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStarted && !gameState.isGameOver && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          isGameOver: prev.timeLeft <= 1,
        }))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStarted, gameState.isGameOver])

  useEffect(() => {
    if (gameState.isGameOver) {
      const newScore: PlayerScore = {
        name: gameState.playerName,
        score: gameState.currentScore,
        date: new Date().toISOString(),
      }
      const updatedScores = [...scores, newScore]
      setScores(updatedScores)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores))
    }
  }, [gameState.isGameOver])

  const handleStartGame = () => {
    setShowNameInput(true)
  }

  const handleNameSubmit = (name: string) => {
    setGameState({
      playerName: name,
      currentScore: 0,
      timeLeft: GAME_TIME,
      isGameOver: false,
    })
    setShowNameInput(false)
    setGameStarted(true)
    handleFetchPokemon()
  }

  const handleReturnToHome = () => {
    setGameStarted(false)
    setGameState({
      playerName: '',
      currentScore: 0,
      timeLeft: GAME_TIME,
      isGameOver: false,
    })
    setPokemon(null)
  }

  const handleFetchPokemon = async () => {
    if (gameState.isGameOver) return

    try {
      setLoading(true)
      setError(null)
      setShowDetails(false)
      setGuess('')
      setGuessResult(null)
      const result = await getRandomPokemon()
      setPokemon(result)
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch Pokemon')
    } finally {
      setLoading(false)
    }
  }

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pokemon || !guess.trim() || gameState.isGameOver) return

    const isCorrect = fuzzyMatch(guess, pokemon.name)
    setGuessResult(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      setGameState(prev => ({
        ...prev,
        currentScore: prev.currentScore + 1,
      }))
    }

    setTimeout(handleFetchPokemon, 1500)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function handleComplete(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/img/background.png")' }}>
      {!gameStarted ? (
        <>
          {showNameInput ? (
            <NameInput onSubmit={handleNameSubmit} />
          ) : (
            <div className="min-h-screen flex items-center justify-center gap-8 px-4">
              <div className="flex-1 max-w-xl">
                <LandingComponent onPlay={handleStartGame} />
              </div>
              <div className="hidden lg:block w-80">
                <Scoreboard scores={scores} />
              </div>
              <div className="mt-8 lg:hidden w-full">
                <Scoreboard scores={scores} />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-[300px] mx-auto mb-4 cursor-pointer" onClick={handleReturnToHome}>
              <Image src="/img/logo.png" alt="PokéScratch" width={300} height={120} priority className="drop-shadow-lg hover:scale-105 transition-transform" />
            </div>
            <div className="flex justify-center gap-4">
              <div className="bg-yellow-300 rounded-full px-4 py-2 shadow-lg">
                <span className="text-red-600 font-bold">Score: {gameState.currentScore}</span>
              </div>
              <div className="bg-yellow-300 rounded-full px-4 py-2 shadow-lg">
                <span className="text-red-600 font-bold">Temps: {formatTime(gameState.timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center">
              {gameState.isGameOver ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Partie terminée !</h2>
                  <p className="text-xl text-yellow-300 mb-6">Score final : {gameState.currentScore} points</p>
                  <button onClick={handleReturnToHome} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform transition hover:scale-105 shadow-lg">
                    Retour à l'accueil
                  </button>
                </div>
              ) : (
                <>
                  {error && <p className="text-red-500 mt-4">{error}</p>}

                  {pokemon && (
                    <div className="mt-8 text-center">
                      <div className="relative">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
                          <ScratchToReveal key={refreshKey} width={300} height={300} backgroundImage="/img/pokeball.png" minScratchPercentage={90} onComplete={handleComplete}>
                            <img src={pokemon.image} alt={pokemon.name} className="w-full h-full object-contain" />
                          </ScratchToReveal>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center gap-3">
                        {pokemon.types.map((type, index) => (
                          <div key={index} className="flex items-center bg-white/20 backdrop-blur-sm gap-2 px-4 py-2 text-base font-bold shadow-md">
                            <img src={pokemon.type_img[index]} alt={type} className="w-10 h-10" />
                            <span>{type}</span>
                          </div>
                        ))}
                      </div>

                      {!guessResult && (
                        <form onSubmit={handleGuessSubmit} className="mt-6">
                          <div className="flex flex-col items-center gap-4">
                            <input
                              type="text"
                              value={guess}
                              onChange={e => setGuess(e.target.value)}
                              placeholder="Entrez le nom du Pokémon..."
                              className="px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 w-64 text-center shadow-md"
                              autoComplete="off"
                            />
                            <div className="flex gap-4">
                              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transform transition hover:scale-105 shadow-lg">
                                Deviner !
                              </button>
                              <button
                                type="button"
                                onClick={handleFetchPokemon}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transform transition hover:scale-105 shadow-lg"
                              >
                                Passer
                              </button>
                            </div>
                          </div>
                        </form>
                      )}

                      {guessResult && (
                        <div className={`mt-6 animate-fade-in ${guessResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                          <h2 className="text-2xl font-bold mb-2">
                            {guessResult === 'correct' ? "Bravo ! C'est " : "Dommage ! C'était "}
                            {pokemon.name}
                          </h2>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
