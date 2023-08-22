# pokemon-evolution
A Node.js application that retrieves the evolution chain for a given Pokémon using [PokéAPI](https://pokeapi.co/docs/v2).

## Setup

The following should be installed on your machine:
- [Node.js](https://nodejs.org/) (Tested with v17.2.0)
- [npm](https://www.npmjs.com/get-npm) (Tested with v8.3.0)

Install the requirements:

```
npm install
```

## Usage
Run the script:

```
npm start
```

Enter your Pokémon in console after the prompt is given (example):

```
Enter your Pokemon here: chimchar
{
    "name": "chimchar",
    "variations": [
        {
            "name": "monferno",
            "variations": [
                {
                    "name": "infernape",
                    "variations": []
                }
            ]
        }
    ]
}
```

## Tests
Run tests using:

```
npm test
```
