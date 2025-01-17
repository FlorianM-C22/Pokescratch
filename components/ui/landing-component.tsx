import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface LandingComponentProps {
  onPlay: () => void
}

export default function LandingComponent({ onPlay }: LandingComponentProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center">
        <motion.div
          className="w-[500px] max-w-full mx-auto mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <Image src="/img/logo.png" alt="PokéScratch" width={500} height={200} priority className="drop-shadow-lg" />
        </motion.div>

        <p className="text-white text-xl md:text-2xl mb-12 drop-shadow-lg">Grattez et devinez le Pokémon caché !</p>

        <motion.button
          onClick={onPlay}
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-700 font-bold text-2xl py-4 px-12 rounded-full transform transition-all shadow-lg border-4 border-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          JOUER !
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="mt-16 bg-black/30 backdrop-blur-sm rounded-lg p-6">
        <h2 className="text-white text-xl font-bold mb-4">Comment jouer ?</h2>
        <ol className="text-white text-left space-y-2">
          <li>1. Grattez la carte pour révéler le Pokémon</li>
          <li>2. Entrez le nom du Pokémon</li>
          <li>3. Validez votre réponse !</li>
        </ol>
      </motion.div>
    </div>
  )
}
