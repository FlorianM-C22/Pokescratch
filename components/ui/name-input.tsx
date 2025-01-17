import React, { useState } from 'react'
import { motion } from 'motion/react'

interface NameInputProps {
  onSubmit: (name: string) => void
}

export default function NameInput({ onSubmit }: NameInputProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères')
      return
    }
    onSubmit(name.trim())
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-black/30 backdrop-blur-sm rounded-lg p-8 w-[90%] max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Entrez votre nom de dresseur</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="Sacha..."
              className="w-full px-4 py-2 rounded-full border-2 border-yellow-400 focus:outline-none focus:border-blue-500"
              maxLength={20}
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
          <motion.button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-700 font-bold py-3 px-6 rounded-full transform transition-all shadow-lg border-2 border-blue-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Commencer !
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
