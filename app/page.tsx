'use client'

import { useState } from 'react'
import { getRandomPokemon } from '@/lib/get_random_pokemon'
import ScratchToReveal from '@/components/ui/scratch-to-reveal'
import LandingComponent from '@/components/ui/landing-component'
import { fuzzyMatch } from '@/lib/utils'
import Image from 'next/image'

interface PokemonData {
  name: string
  types: string[]
  image: string
}

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  const [pokemon, setPokemon] = useState<PokemonData | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [guessed, setGuessed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [guess, setGuess] = useState('')
  const [guessResult, setGuessResult] = useState<'correct' | 'incorrect' | null>(null)

  const handleStartGame = () => {
    setGameStarted(true)
    handleFetchPokemon()
  }

  const handleFetchPokemon = async () => {
    try {
      setLoading(true)
      setError(null)
      setShowDetails(false)
      setGuessed(false)
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

  const handleComplete = () => {
    setShowDetails(true)
  }

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pokemon || !guess.trim()) return

    const isCorrect = fuzzyMatch(guess, pokemon.name)
    setGuessResult(isCorrect ? 'correct' : 'incorrect')
    setGuessed(true)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/img/background.png")' }}>
      {!gameStarted ? (
        <LandingComponent onPlay={handleStartGame} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-[300px] mx-auto mb-4">
              <Image src="/img/logo.png" alt="PokéScratch" width={300} height={120} priority className="drop-shadow-lg" />
            </div>
            <div className="bg-yellow-300 rounded-full px-4 py-2 inline-block shadow-lg">
              <span className="text-red-600 font-bold">Score: {score}</span>
            </div>
          </div>

          {/* Game Area */}
          <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center">
              <button
                onClick={handleFetchPokemon}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transform transition hover:scale-105 disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Loading...' : 'Get Random Pokémon'}
              </button>

              {error && <p className="text-red-500 mt-4">{error}</p>}

              {pokemon && (
                <div className="mt-8 text-center">
                  <div className="relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full z-10 shadow-lg">Who's that Pokémon?</div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
                      <ScratchToReveal key={refreshKey} width={300} height={300} onComplete={handleComplete} backgroundImage="/img/pokeball.png">
                        <img src={pokemon.image} alt={pokemon.name} className="w-full h-full object-contain" />
                      </ScratchToReveal>
                    </div>
                  </div>

                  {!guessed && (
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
                        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transform transition hover:scale-105 shadow-lg">
                          Deviner !
                        </button>
                      </div>
                    </form>
                  )}

                  {guessed && (
                    <div className={`mt-6 animate-fade-in ${guessResult === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                      <h2 className="text-2xl font-bold mb-2">
                        {guessResult === 'correct' ? "Bravo ! C'est " : "Dommage ! C'était "}
                        {pokemon.name}
                      </h2>
                      <div className="flex justify-center gap-2">
                        {pokemon.types.map((type, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-200 rounded-full text-sm shadow">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
