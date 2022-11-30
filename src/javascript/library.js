import BigPicture from 'bigpicture';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { libRefs } from './libRefs';
import { renderLibraryMarkup } from './renderLibraryMarkUp';
import { ThemoviedbAPI } from './themoviedbAPI';
import { createModalMarkUp } from './renderModalMarkUp';
import { spinnerPlay, spinnerStop } from './spiner';
import { get, removeLocal } from './localStorageUse';
import { libraryFooterModalOpen } from './libraryFooterModalOpen';

const themoviedbAPI = new ThemoviedbAPI();

try {
  spinnerPlay();
  renderWatchedMovies();
  libRefs.footerLink.addEventListener('click', libraryFooterModalOpen);
} catch (error) {
  console.log(error);
} finally {
  spinnerStop();
}

libRefs.watchBtn.addEventListener('click', renderWatchedMovies);
libRefs.queueBtn.addEventListener('click', renderQueueMovies);
libRefs.library.addEventListener('click', onMovieCardClick);

function displayBg(array) {
  const emptyTitle = document.querySelector('.js-title-queue');
  const emptyImg = document.querySelector('.js-library-bg-image');
  const mainEl = document.querySelector('main');
  if (array.length > 0) {
    emptyTitle.classList.add('visually-hidden');
    emptyImg.classList.add('visually-hidden');
    mainEl.classList.remove('perspective');
  }
  if (array.length === 0) {
    emptyTitle.classList.remove('visually-hidden');
    emptyImg.classList.remove('visually-hidden');
    mainEl.classList.add('perspective');
  }
}

async function renderWatchedMovies() {
  libRefs.library.innerHTML = '';
  const watchedMovies = get(themoviedbAPI.WATCH_KEY);
  displayBg(watchedMovies);
  const watchedMoviesIds = watchedMovies.map(movie => movie.id);
  watchedMoviesIds.forEach(async id => {
    const movie = await themoviedbAPI.fetchMovieById(id);
    const genre = movie.genres.map(genre => genre.name);
    if (genre.length > 2) {
      genre.splice(2, genre.length - 1, 'Other');
    }
    if (genre.length === 0) {
      genre.push('Other');
    }
    libRefs.library.insertAdjacentHTML(
      'beforeend',
      renderLibraryMarkup(movie, genre.join(', '))
    );
    libRefs.library.lastElementChild.setAttribute('data-status', 'watched');
  });
}

async function renderQueueMovies() {
  libRefs.library.innerHTML = '';
  const queueMovies = get(themoviedbAPI.QUEUE_KEY);
  displayBg(queueMovies);
  const queueMoviesIDes = queueMovies.map(movie => movie.id);
  queueMoviesIDes.forEach(async id => {
    const movie = await themoviedbAPI.fetchMovieById(id);
    const genre = movie.genres.map(genre => genre.name);
    if (genre.length > 2) {
      genre.splice(2, genre.length - 1, 'Other');
    }
    if (genre.length === 0) {
      genre.push('Other');
    }
    libRefs.library.insertAdjacentHTML(
      'beforeend',
      renderLibraryMarkup(movie, genre.join(', '))
    );
    libRefs.library.lastElementChild.setAttribute('data-status', 'queue');
  });
}

async function onMovieCardClick(event) {
  const movieCard = event.target.closest('.gallery__item');
  try {
    spinnerPlay();
    const movieId = movieCard.dataset.id;

    const movieStatus = movieCard.dataset.status;

    await themoviedbAPI.fetchMovieById(movieId).then(data => {
      const posterPath = data.poster_path
        ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
        : `https://astoriamuseums.org/wp-content/uploads/2020/10/OFM-poster-not-available.png`;
      const releaseYear = new Date(Date.parse(data.release_date)).getFullYear();
      const filmData = {
        id: data.id,
        poster: posterPath,
        title: data.title,
        originalTitle: data.original_title,
        genres: [],
        popularity: data.popularity.toFixed(1),
        overview: data.overview,
        vote_average: data.vote_average.toFixed(1),
        vote_count: data.vote_count,
        release_date: releaseYear,
      };

      data.genres.forEach(genre => {
        filmData.genres.push(genre.name);
      });
      filmData.genres = filmData.genres.join(', ');

      createModalMarkUp(filmData);

      const removeFromWatchedBtn = document.querySelector(
        '.lightbox-modal__watched-button'
      );
      const removeFromQuequeBtn = document.querySelector(
        '.lightbox-modal__queque-button'
      );

      checkLocalStorageLibrary(
        themoviedbAPI.WATCH_KEY,
        filmData,
        removeFromWatchedBtn,
        'Remove from Watched',
        onRemoveFromWatchedClick,
        'watched'
      );

      checkLocalStorageLibrary(
        themoviedbAPI.QUEUE_KEY,
        filmData,
        removeFromQuequeBtn,
        'Remove from Queque',
        onRemoveFromQuequeClick,
        'queue'
      );

      function onRemoveFromWatchedClick(e) {
        const movieId = e.target.dataset.btn;
        if (e.target.dataset.list === 'watched') {
          removeLocal(themoviedbAPI.WATCH_KEY, movieId);
          movieCard.remove();
          e.target.textContent = 'Removed from Watched';
          e.target.disabled = true;
        }
      }

      function onRemoveFromQuequeClick(e) {
        const movieId = e.target.dataset.btn;
        if (e.target.dataset.list === 'queue') {
          removeLocal(themoviedbAPI.QUEUE_KEY, movieId);
          movieCard.remove();
          e.target.textContent = 'Removed from Queque';
          e.target.disabled = true;
        }
      }
    });

    // removeFromWatchedBtn.textContent = 'Remove from Watched';

    // removeFromQuequeBtn.textContent = 'Remove from Queque';
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
}

function checkLocalStorageLibrary(key, filmData, btn, btnText, fn, status) {
  const locStorage = get(key);
  const currentFilm = filmData;
  const includesFilm = locStorage.find(film => film.id === currentFilm.id);

  if (includesFilm) {
    btn.dataset.list = `${status}`;
    btn.textContent = `${btnText}`;
    btn.addEventListener('click', fn);
  }
  if (!includesFilm) {
    btn.classList.add('visually-hidden');
  }
}
