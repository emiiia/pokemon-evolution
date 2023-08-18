const axios = require("axios");

const parseChain: any = (chain: any) => {
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

const getEvolutionChain = async (pokemonName: string) => {
  try {
    const responseSpecies = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`
    );

    // Get the url for the evolution chain API
    const evolutionChainAPI = responseSpecies.data["evolution_chain"]["url"];

    // Get the chain JSON
    const responseEvolution = await axios.get(evolutionChainAPI);
    const chain = responseEvolution.data["chain"];

    // Parse the response into a format showing names and variations
    const evolutionChain = parseChain(chain);

    // Stringify and format the chain result for readability
    const formattedChain = JSON.stringify(evolutionChain, null, 4);

    console.log(formattedChain);

    return formattedChain;
  } catch (error) {
    console.error(`Error fetching data for ${pokemonName}: ${error}`);
    return null;
  }
};

// getEvolutionChain("eevee");

module.exports = getEvolutionChain;
