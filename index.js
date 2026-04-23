
class Pokemon{
    constructor(id,name,types,defaultSprite,shinySprite,spriteFemale,spriteShinyFamale){
        this.id = id;
        this.name = name;
        this.types = types; 
        this.defaultSprite = defaultSprite;
        this.shinySprite = shinySprite;
        if(spriteFemale != null){
            this.spriteFemale = spriteFemale;
            this.spriteShinyFamale = spriteShinyFamale;
        }
    }
    toString(){
        console.log(`${this.id}: ${this.name} (${this.types})`);
    }
}

async function fetchPokemon(){
    const numberOfPokemon = 1025;
    const container = document.getElementById('pokedex-container');
    for( let i=1; i <= numberOfPokemon; i++){
        pokemon = await getPokemon(i);
        if (pokemon) {
            renderCard(pokemon, container);
        }
    }
}

async function getPokemon(id_name){
    const URL = `https://pokeapi.co/api/v2/pokemon/${id_name}/`;
    const response = await fetch(URL);
    if(response.status == 200 && response.ok){
        const json = await response.json();
        //Get pokemon name, id, and sprites
        const { 
            id, 
            name,
            sprites:{
                front_default: spriteDefault,
                front_female: spriteFemale,
                front_shiny: spriteShiny,
                front_shiny_female: spriteShinyFamale,   
            }
        } = json;
        //Get pokemon types
        let types = await [json.types[0].type.name];
        try {
            types.push(await json.types[1].type.name);
        } catch (error) {
            types.push(null)
        }
        //console.log(`${name}: ${types}`);
        return pokemon = new Pokemon(id,name,types,spriteDefault,spriteShiny,spriteFemale,spriteShinyFamale);
    }
}

function renderCard(pokemon, container) {
    // Filtra tipos nulos para não exibir no HTML
    const filteredTypes = pokemon.types.filter(type => type !== null);
    
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const typesHTML = filteredTypes.map(type => 
        `<span class="type-badge ${type}">${type}</span>`
    ).join('');

    card.innerHTML = `
        <span class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</span>
        <img class="pokemon-image" src="${pokemon.defaultSprite}" alt="${pokemon.name}">
        <h2 class="pokemon-name">${pokemon.name}</h2>
        <div class="types-container">${typesHTML}</div>
    `;

    container.appendChild(card);
}

fetchPokemon();