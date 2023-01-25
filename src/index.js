import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listOfCountries = document.querySelector('.country-list');
const descriptionOfCounry = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  if (event.target.value.trim() === '') {
    deleteRenderCountries();
  } else {
    searchCountries();
  }
}

function searchCountries() {
  const inputValue = inputEl.value;

  fetchCountries(inputValue)
    .then(data => {
      deleteRenderCountries();
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length <= 10 && data.length >= 2) {
        renderMarkupList(data);
      } else {
        renderMarkup(data);
      }
    })
    .catch(error => {
      deleteRenderCountries();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkupList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="list-item"><img class="list-image" src= ${country.flags.png} alt="Flag of${country.name.common}">
    <p>${country.name.common}</p></li>`;
    })
    .join('');
  listOfCountries.innerHTML = markup;
}

function renderMarkup(country) {
  const markup = `<div class = "country-box">
        <img class = "country-flag" src= ${country[0].flags.png} alt="${
    country[0].name.common
  }">
    <p class = "country-name">${country[0].name.common}</p>
    </div>
    <div>
      <p class="country-capital">Capital: ${country[0].capital}</p>
      <p class="country-population">Population: ${country[0].population}</p>
      <p class="country-languages">Languages: ${Object.values(
        country[0].languages
      )}</p>
    </div>`;
  descriptionOfCounry.innerHTML = markup;
}

function deleteRenderCountries() {
  listOfCountries.innerHTML = '';
  descriptionOfCounry.innerHTML = '';
}