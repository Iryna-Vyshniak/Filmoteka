import BigPicture from 'bigpicture';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { libRefs } from './libRefs';
import { refs } from './refs';
import { renderMarkup } from './renderMarkup';
import { ThemoviedbAPI } from './themoviedbAPI';
import { getItems } from './movie-modal';
import { spinnerPlay, spinnerStop } from './spiner';
import { callfooterModal } from './footerModal';
import { renderGenres } from './renderGenres';
import { get, remove } from './localStorageUse';
import { paginOptions } from './paginOptions';

const themoviedbAPI = new ThemoviedbAPI();
const pagination = new Pagination(libRefs.paginationContainer, paginOptions);
const page = pagination.getCurrentPage();

try {
    spinnerPlay();
    renderWatchedMovies();
} catch (error) {
    console.log(error);
} finally {
    spinnerStop();
}

libRefs.watchBtn.addEventListener('click', renderWatchedMovies);
libRefs.queueBtn.addEventListener('click', renderQueueMovies);

async function renderWatchedMovies() {
    libRefs.library.innerHTML = '';
    const watchedMovies = get(themoviedbAPI.WATCH_KEY);
    const watchedMoviesIDes = watchedMovies.map(movie => movie.id);
    watchedMoviesIDes.forEach(async id => {
        const movie = await themoviedbAPI.fetchMovieById(id);
        const genre = movie.genres.map(genre => genre.name);
        if (genre.length > 2) {
            genre.splice(2, genre.length - 1, 'Other');
        }
        if (genre.length === 0) {
            genre.push('Other');
        }
        libRefs.library.insertAdjacentHTML('afterbegin', renderMarkup(movie, genre.join(', ')));
    });
}

async function renderQueueMovies() {
    libRefs.library.innerHTML = '';
    const queueMovies = get(themoviedbAPI.QUEUE_KEY);
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
        libRefs.library.insertAdjacentHTML('afterbegin', renderMarkup(movie, genre.join(', ')));
    });
}