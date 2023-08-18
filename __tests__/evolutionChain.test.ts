const getEvolutionChain = require("../src/index");
import {
  caterpieJSON,
  eeveeJSON,
  wurmpleJSON,
  spiritombJSON,
} from "../__data__/mockData";
import {
  caterpieChain,
  eeveeChain,
  wurmpleChain,
  spiritombChain,
} from "../__data__/chainResults";
import axios from "axios";

jest.mock("axios");

const mockAPI = (mockData: any) => {
  (axios.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("pokemon-species")) {
      return Promise.resolve({
        data: {
          evolution_chain: {
            url: "https://pokeapi.co/api/v2/evolution-chain/test",
          },
        },
      });
    } else if (url.includes("evolution-chain")) {
      return Promise.resolve({ data: mockData });
    }
  });
};

describe("Evolution Chain Tests", () => {
  it("should return the chain for the first evolution", async () => {
    mockAPI(caterpieJSON);

    // Get the chain of the first evolution
    const result = await getEvolutionChain("caterpie");

    // The full chain is returned
    expect(result).toEqual(JSON.stringify(caterpieChain, null, 4));
  });

  it("should return the chain for the middle evolution", async () => {
    mockAPI(caterpieJSON);

    // Get the chain of the middle evolution
    const result = await getEvolutionChain("metapod");

    // The full chain is returned
    expect(result).toEqual(JSON.stringify(caterpieChain, null, 4));
  });

  it("should return the chain for the final evolution", async () => {
    mockAPI(caterpieJSON);

    // Get the chain of the final evolution
    const result = await getEvolutionChain("butterfree");

    // The full chain is returned
    expect(result).toEqual(JSON.stringify(caterpieChain, null, 4));
  });

  it("should return all possible second evolution variations", async () => {
    mockAPI(eeveeJSON);

    // Pokemon with multiple second evolutions
    const result = await getEvolutionChain("eevee");

    // Variations array should contain all Eevee second evolution variations
    expect(result).toEqual(JSON.stringify(eeveeChain, null, 4));
  });

  it("should return all possible second and third variations", async () => {
    mockAPI(wurmpleJSON);

    // Pokemon with multiple second evolutions that also have their own evolution
    const result = await getEvolutionChain("wurmple");

    // Second evolution's variations are accounted for
    expect(result).toEqual(JSON.stringify(wurmpleChain, null, 4));
  });

  it("should return full chain when given a deeply nested pokemon", async () => {
    mockAPI(wurmpleJSON);

    // Pokemon with multiple pre-evolutions
    const result = await getEvolutionChain("dustox");

    // The full chain is returned
    expect(result).toEqual(JSON.stringify(wurmpleChain, null, 4));
  });

  it("should return an empty variations array for a pokemon with no evolution", async () => {
    mockAPI(spiritombJSON);

    // Pokemon with no evolution
    const result = await getEvolutionChain("spiritomb");

    // Variations array should be empty
    expect(result).toEqual(JSON.stringify(spiritombChain, null, 4));
  });

  it("should return null when an error is thrown", async () => {
    // Mock API to return an empty object
    mockAPI({});

    // Invalid API response from e.g. invalid Pokemon name
    const result = await getEvolutionChain("notapokemon");

    // Result should be null
    expect(result).toEqual(null);
  });
});
