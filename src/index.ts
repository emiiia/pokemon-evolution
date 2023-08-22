const axios = require("axios");
const NodeCache = require( "node-cache" ); 
const prompt = require('prompt-sync')({sigint: true});


interface Chain {
  evolves_to: Chain[];
  species: {
    name: string;
  };
}

interface EvolutionChain {
  name: string;
  variations: EvolutionChain[];
}

/**
 * Converts the evolution chain JSON response to a nested object of names and variations
 * 
 * @param chain  Chain JSON response from the evolution chain API
 * @returns Object of species names and variations
 */
const parseChain = (chain: Chain): EvolutionChain => {
  let variations = [];
  // Pokemon can have multiple variations for the next evolution (e.g. Eevee)
  for (let i = 0; i < chain.evolves_to.length; i++) {
    // For each possible next evolution, get the name and variations
    variations.push(parseChain(chain.evolves_to[i]));
  }

  return {
    name: chain.species.name,
    variations,
  };
};

/**
 * 
 * @param pokemonName Name of the Pokemon
 * @returns Evolution chain API URL of the given Pokemon
 */
const fetchPokemonSpecies = async (pokemonName: string) => {
  try {
    const responseSpecies = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`
    );

    // Get the url for the evolution chain API
    const evolutionChainAPI = responseSpecies.data["evolution_chain"]["url"];

    return evolutionChainAPI;
  } catch (error) {
    const errorMessage = `Failed to fetch species. ${error}`;
    throw new Error(errorMessage);
  }
}

/**
 * 
 * @param url URL to fetch the evolution chain
 * @returns Chain JSON response from the evolution chain API
 */
const fetchEvolutionChain = async (url: string) => {
  try {
    // Get the chain JSON
    const responseEvolution = await axios.get(url);
    const chain = responseEvolution.data["chain"];
    return chain;
  } catch (error) {
    const errorMessage = `Failed to fetch evolution chain data with URL ${url}. ${error}`;
    throw new Error(errorMessage);
  }
}

/**
 * Returns the full evolution chain of a given Pokemon
 * 
 * @param pokemonName Name of the Pokemon
 * @returns JSON string of species names and variations
 */
const getEvolutionChain = async (pokemonName: string, chainCache: typeof NodeCache) => {
  try {
    // Ensure valid string has been given
    const re = new RegExp("^[a-zA-Z]+$");
    if (!(re.test(pokemonName))) {
      throw new Error('Please enter a valid Pokemon name.');
    }

    // Check if chain result has been cached for this pokemon 
    if (chainCache.has(pokemonName)) {
      return chainCache.get(pokemonName);
    } 

    // API requests
   const evolutionChainAPI = await fetchPokemonSpecies(pokemonName);
   const chain = await fetchEvolutionChain(evolutionChainAPI);

    // Parse the response into a format showing names and variations
    const evolutionChain = parseChain(chain);

    // Convert to JSON string and format the chain result for readability
    const formattedChain = JSON.stringify(evolutionChain, null, 4);

    // Set chain in cache
    chainCache.set(pokemonName, formattedChain);
    return formattedChain;
  } catch (error) {
    console.error(`\nError getting chain for Pokemon "${pokemonName}":\n${error}\n`);
    return null;
  }
};

const main = async () => {
  // Set up caching to avoid unnecessary API calls
  const chainCache = new NodeCache({stdTTL: 20});

  while (true) {
    const pokemonName = await prompt('Enter your Pokemon here: ');
    const chain = await getEvolutionChain(pokemonName, chainCache);
    chain && console.log(chain);
  }
}


if (typeof require !== 'undefined' && require.main === module) {
  main();
}

module.exports = getEvolutionChain;
