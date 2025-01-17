import React from 'react'
import { motion } from 'motion/react'
import { PlayerScore } from '@/lib/types'

interface ScoreboardProps {
  scores: PlayerScore[]
}

export default function Scoreboard({ scores }: ScoreboardProps) {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-black/30 backdrop-blur-sm rounded-lg p-6 w-[90%] max-w-md mx-auto mt-8">
      <h2 className="text-white text-xl font-bold mb-4 text-center">Meilleurs Scores</h2>
      <div className="space-y-2">
        {sortedScores.map((score, index) => (
          <motion.div
            key={`${score.name}-${score.date}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between bg-white/10 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-yellow-300 font-bold">{index + 1}.</span>
              <span className="text-white">{score.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{score.score} pts</span>
              <span className="text-gray-300 text-sm">{new Date(score.date).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
        {sortedScores.length === 0 && <p className="text-gray-300 text-center italic">Aucun score enregistré</p>}
      </div>
    </motion.div>
  )
}
