import BigPicture from 'bigpicture';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { libRefs } from './libRefs';
import { renderMarkup } from './renderMarkup';
import { ThemoviedbAPI } from './themoviedbAPI';
import { createModalMarkUp } from './renderModalMarkUp';
import { spinnerPlay, spinnerStop } from './spiner';
import { get, removeLocal } from './localStorageUse';
import { libraryFooterModalOpen } from './libraryFooterModalOpen';

const themoviedbAPI = new ThemoviedbAPI();

try {
    spinnerPlay();
    renderWatchedMovies();
    libRefs.footerLink.addEventListener("click", libraryFooterModalOpen);
} catch (error) {
    console.log(error);
} finally {
    spinnerStop();
}

libRefs.watchBtn.addEventListener('click', renderWatchedMovies);
libRefs.queueBtn.addEventListener('click', renderQueueMovies);
libRefs.library.addEventListener('click', onMovieCardClick);

async function renderWatchedMovies() {
    libRefs.library.innerHTML = '';
    const watchedMovies = get(themoviedbAPI.WATCH_KEY);
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
        libRefs.library.insertAdjacentHTML('beforeend', renderMarkup(movie, genre.join(', ')));
        libRefs.library.lastElementChild.setAttribute('data-status', 'watched');
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
        libRefs.library.insertAdjacentHTML('beforeend', renderMarkup(movie, genre.join(', ')));
        libRefs.library.lastElementChild.setAttribute('data-status', 'queue');
    });
}

async function onMovieCardClick(event) {
    const movieCard = event.target.closest('.gallery__item');
    try {
        spinnerPlay();
        const movieId = movieCard.dataset.id;
        const movieStatus = movieCard.dataset.status;
        console.log(movieStatus);
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
                popularity: data.popularity,
                overview: data.overview,
                vote_average: data.vote_average,
                vote_count: data.vote_count,
                release_date: releaseYear,
            };

            data.genres.forEach(genre => {
                filmData.genres.push(genre.name);
            });
            filmData.genres = filmData.genres.join(', ');

            createModalMarkUp(filmData);

        });

        const removeFromWatchedBtn = document.querySelector(
            '.lightbox-modal__watched-button'
        );
        removeFromWatchedBtn.textContent = "Remove from Watched";

        const removeFromQuequeBtn = document.querySelector(
            '.lightbox-modal__queque-button'
        );
        removeFromQuequeBtn.textContent = "Remove from Queque";

        removeFromWatchedBtn.addEventListener('click', (e) => {
            const movieId = e.target.closest('.lightbox-modal').dataset.id;
            removeLocal(themoviedbAPI.WATCH_KEY, movieId);
            if (movieStatus === 'watched') {
                movieCard.remove();
            }
        });
        removeFromQuequeBtn.addEventListener('click', (e) => {
            const movieId = e.target.closest('.lightbox-modal').dataset.id;
            removeLocal(themoviedbAPI.QUEUE_KEY, movieId);
            if (movieStatus === 'queue') {
                movieCard.remove();
            }

        }
        );
    } catch (error) {
        console.log(error);
    } finally {
        spinnerStop();
    }
}