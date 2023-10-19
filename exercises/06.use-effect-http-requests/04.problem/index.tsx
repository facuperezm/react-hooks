import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
} from '~/shared/pokemon'
import type {PokemonData} from '~/shared/types'

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [status, setStatus] = React.useState('idle')
  const [pokemon, setPokemon] = React.useState<null | PokemonData>(null)
  const [error, setError] = React.useState<null | Error>(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setStatus('pending')
    fetchPokemon(pokemonName).then(
      pokemon => {
        setPokemon(pokemon)
        setStatus('resolved')
      },
      error => {
        setError(error)
        setStatus('rejected')
      },
    )
  }, [pokemonName])

  if (status === 'idle') {
    return <span>Submit a pokemon</span>
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected' && error !== null) {
    return (
      <div>
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (status === 'resolved' && pokemon !== null) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
