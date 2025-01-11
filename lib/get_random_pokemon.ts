interface PokemonType {
  name: string
  image: string
}

interface Pokemon {
  name: {
    en: string
    fr: string
    jp: string
  }
  types: PokemonType[]
  sprites: {
    regular: string
    shiny: string | null
    gmax: {
      regular: string
      shiny: string
    } | null
  }
}

export async function getRandomPokemon(): Promise<{
  name: string
  types: string[]
  image: string
}> {
  try {
    const response = await fetch('https://tyradex.vercel.app/api/v1/pokemon')
    const data = await response.json()

    const randomIndex = Math.floor(Math.random() * data.length)
    const pokemon: Pokemon = data[randomIndex]

    if (randomIndex === 0) {
      return getRandomPokemon()
    }

    return {
      name: pokemon.name.fr,
      types: pokemon.types?.map(type => type.name) || [],
      image: pokemon.sprites.regular,
    }
  } catch (error) {
    console.error('Error fetching Pokémon:', error)
    throw new Error('Failed to fetch Pokémon')
  }
}
