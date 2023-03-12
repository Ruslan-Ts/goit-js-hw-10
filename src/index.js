import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputForm = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputForm.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry() {
  const countryName = inputForm.value.trim();

  if (countryName === '') {
    (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }
  fetchCountries(countryName)
    .then(countries => {
      console.log(countries);
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML('beforeend', getCountryList);
        countryInfo.insertAdjacentHTML('beforeend', getCountryInfo);
      } else if (countries.length >= 10) {
        moreSpecificName();
      } else {
        countryList.insertAdjacentHTML('beforeend', getCountryList);
      }
    })
    .catch(noCountryName);
}

function getCountryList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class="country-list">
  <img src="${flags.svg}" alt="${flags.alt}" width="30px" height="20px">
  <h2 class="country-name">${name.official}</h2>
</li>`;
    })
    .join('');
  return markup;
}

function getCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `<ul class="js-list">
        <li>Capital: ${capital}</li>
        <li>Population: ${population}</li>
        <li>Languages: ${Object.values.languages}</li>
        </ul>`;
    })
    .join('');
  return markup;
}

function moreSpecificName() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function noCountryName() {
  Notiflix.Notify.warning('Oops, there is no country with that name');
}
