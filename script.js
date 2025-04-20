const container = document.getElementById('pokemon-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Variables para la paginación
let offset = 0;
const limit = 18;

// Obtenemos los Pokemon desde la API
async function fetchPokemonList() {
    container.innerHTML = '';
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        for (let pokemon of data.results) {
            await fetchPokemonDetails(pokemon.url);
        }
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        container.innerHTML = `<p>Hubo un error al obtener los Pokemon.</p>`;
    }
}

// Obtenemos los detalles de cada Pokemon
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        container.innerHTML = `<p>Hubo un error al obtener los detalles del Pokemon.</p>`;
    }
}

// Mostramos los Pokemon en la interfaz
function displayPokemon(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    const types = pokemon.types.map(t => t.type.name).join(', ');

    const audio = document.createElement('audio');
    audio.src = pokemon.cries.latest;

    card.innerHTML = `
    <h3>${pokemon.name}</h3>
    <img src="${pokemon.sprites.other.showdown.front_default}" alt="${pokemon.name}" />
    <p><strong>Tipo:</strong> ${types}</p>
    <audio src="${pokemon.cries.latest}"></audio>
    `;

    card.appendChild(audio);

    card.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.volume = 0.1;
        audio.play();
    });

    container.appendChild(card);
}

// Buscamos Pokemon por nombre
async function searchPokemonByName(name) {
    container.innerHTML = '';
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            container.innerHTML = `<p>Pokemon no encontrado.</p>`;
            return;
        }
        const data = await response.json();
        displayPokemon(data);
    } catch (error) {
        console.error('Error searching Pokémon:', error);
        container.innerHTML = `<p>Hubo un error al buscar el Pokemon.</p>`;
    }
}

// Eventos para los botones de búsqueda y paginación
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchPokemonByName(query);
    } else {
        fetchPokemonList();
    }
});

nextBtn.addEventListener('click', () => {
    offset += limit;
    fetchPokemonList();
});

prevBtn.addEventListener('click', () => {
    if (offset >= limit) {
        offset -= limit;
        fetchPokemonList();
    }
});

// Inicializamos la lista de Pokemon
fetchPokemonList();
