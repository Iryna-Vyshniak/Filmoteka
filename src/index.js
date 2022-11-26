import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';

import { set, get, remove, clear } from './javascript/localStorageUse';
import { refs } from './javascript/refs';
import { renderMarkup } from './javascript/renderMarkup';
import { ThemoviedbAPI } from './javascript/themoviedbAPI';

import { getItems } from './javascript/movie-modal';
import './javascript/movie-modal';
import './javascript/footerModal';

const themoviedbAPI = new ThemoviedbAPI();

try {
  startPage();
} catch (error) {
  console.log(error);
}

export let allProducts = null;


async function startPage() {
  const genresIds = await themoviedbAPI.fetchGenres();
  const trendMovies = await themoviedbAPI.fetchFavouritesMovies();

  const markup = trendMovies.results
    .map(movie => {
      const genresName = [];

      movie.genre_ids.forEach(genre => {
        themoviedbAPI.genres.forEach(item => {
          if (item.id === genre) {
            genresName.push(item.name);
          }
        });
      });
      if (genresName.length > 2) {
        genresName.splice(2, genresName.length - 1, 'Other');
      }
      return renderMarkup(movie, genresName.join(', '));
    })
    .join('');
  refs.gallery.innerHTML = markup;
}


//  HEADER


const onSearchFormSubmit = async event => {
  event.preventDefault();
  themoviedbAPI.query = event.target.elements.search.value;

  try {
    const searchMovies = await themoviedbAPI.fetchMoviesByQuery();
    const markup = searchMovies.results.map(renderMarkup).join('');
    refs.gallery.innerHTML = markup;
  }
  catch (err) {
    console.log(err)
  }
  event.target.reset();
}
refs.formEl.addEventListener('submit', onSearchFormSubmit);