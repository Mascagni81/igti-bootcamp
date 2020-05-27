/*
Estado da aplicação (state)
*/
let tabCountries = null; //aba lista de paises
let tabFavorites = null;

let allCountries = [];
let favoritesCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');

  //prettier-ignore
  totalPopulationFavorites = 
    document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  //fetchCountries faz a invocação
  fetchCountries();
});

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();

  allCountries = json.map((country) => {
    const { numericCode, translations, population, flag } = country;

    return {
      id: numericCode,
      name: translations.pt,
      population,
      formattedPopulation: formatNumber(population),
      flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();

  handleCountryButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    //"waves-effect waves-light btn" - Materialize
    const countryHTML = `
     <div class='country'>
       <div>
         <a id="${id}" class="waves-effect waves-light btn">+</a>
       </div>
       <div>
         <img src="${flag}" alt="${name}">
       </div>
       <div>
         <ul>
          <li>País: ${name}</li>
          <li>População: ${formattedPopulation}</li>
         </ul>
       </div>
     </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}

function renderFavorites() {
  let favoritesHTML = '<div>';

  favoritesCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoriteCountryHTML = `
      <div class='country'>
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4">-</a>
        </div>
        <div>
          <img src="${flag}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>País: ${name}</li>
            <li>População: ${formattedPopulation}</li>
          </ul>
        </div>
      </div>
      `;

    favoritesHTML += favoriteCountryHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

//Código abaixo exibe o total de países e população:
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoritesCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoritesCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}

/*
Implementar handleCountryButtons com querySelectorAll e forEach, 
adicionando listener nos botões passando button.id
*/
function handleCountryButtons() {
  const countryButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoriteButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countryButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);
  favoritesCountries = [...favoritesCountries, countryToAdd];

  /*
  ordena os países .sort
  */
  favoritesCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  /*
  Remove os países
  */
  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}

function removeFromFavorites(id) {
  const countryToRemove = favoritesCountries.find(
    (country) => country.id === id
  );
  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  favoritesCountries = favoritesCountries.filter(
    (country) => country.id !== id
  );

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
