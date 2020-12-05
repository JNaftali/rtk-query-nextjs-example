import { useState } from "react"
import { useSelector } from "react-redux"
import { pokemonApi, useGetPokemonByNameQuery } from "../services/pokemon"
import { initializeStore, removeUndefined } from "../store"

export default function Home(props) {
  const {data: pokemonList} = useSelector(pokemonApi.endpoints.getPokemonList.select())
  const [pokemon, setPokemon] = useState(props.initialPokemon)

  const {data: currentPokemon} = useGetPokemonByNameQuery(pokemon)

  return (
    <>
    <h1>Hi</h1>
  <h2>You caught {pokemon}! They can have one of these abilities: {currentPokemon.abilities.map(ab => ab.ability.name).join(', ')}</h2>
    <p>
      Catch another!
      <select value={pokemon} onChange={e => setPokemon(e.currentTarget.value)}>
        {pokemonList.results.map(pok => <option>{pok.name}</option>)}
      </select>
    </p>
    </>
  )
}

export async function getServerSideProps() {
  const store = initializeStore()
  await store.dispatch(pokemonApi.endpoints.getPokemonList.initiate())
  const {data: pokemonList} = pokemonApi.endpoints.getPokemonList.select()(store.getState())
  const initialPokemon = pokemonList.results[0].name

  await store.dispatch(pokemonApi.endpoints.getPokemonByName.initiate(initialPokemon))

  // queryRef.unsubscribe() // I am not sure if something like this is necessary

  return { props: { initialReduxState: removeUndefined(store.getState()), initialPokemon } }
}