import { getRandomPokemon } from '../get_random_pokemon'

describe('Pokemon API', () => {
  test('should fetch a random pokemon', async () => {
    const pokemon = await getRandomPokemon()

    expect(pokemon).toHaveProperty('name')
    expect(pokemon).toHaveProperty('types')
    expect(pokemon).toHaveProperty('type_img')
    expect(pokemon).toHaveProperty('image')
    expect(typeof pokemon.name).toBe('string')
    expect(Array.isArray(pokemon.types)).toBe(true)
    expect(Array.isArray(pokemon.type_img)).toBe(true)
    expect(typeof pokemon.image).toBe('string')
  })
})
