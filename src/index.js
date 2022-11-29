import BigPicture from 'bigpicture';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { refs } from './javascript/refs';
import { renderMarkup } from './javascript/renderMarkup';
import { ThemoviedbAPI } from './javascript/themoviedbAPI';
import { getItems } from './javascript/movie-modal';
import { spinnerPlay, spinnerStop } from './javascript/spiner';
import './javascript/movie-modal';
import { callfooterModal } from './javascript/footerModal';
import { scrollFunction } from './javascript/scroll';

const themoviedbAPI = new ThemoviedbAPI();
const pagination = new Pagination(refs.paginationContainer, refs.paginOptions);

try {
  spinnerPlay();
  startPage();
  refs.footerLink.addEventListener("click", callfooterModal);
  window.addEventListener('scroll', scrollFunction);
} catch (error) {
  console.log(error);
} finally {
  spinnerStop();
}

export let allProducts = null;

async function startPage() {
  const genresIds = await themoviedbAPI.fetchGenres();
  const trendMovies = await themoviedbAPI.fetchFavouritesMovies(page);

  const totalMovies = trendMovies.total_results;
  pagination.reset(totalMovies);

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
  allProducts = [...getItems()];
}

//  HEADER

const onSearchFormSubmit = async event => {
  event.preventDefault();
  themoviedbAPI.query = event.target.elements.search.value;

  try {
    spinnerPlay()
    const searchMovies = await themoviedbAPI.fetchMoviesByQuery(page);
    const markup = searchMovies.results.map(renderMarkup).join('');
    const totalMovies = searchMovies.total_results;
    pagination.off('beforeMove', loadMoreFavouritesMovies);
    pagination.off('beforeMove', loadMoreMoviesByQuery);
    pagination.on('beforeMove', loadMoreMoviesByQuery);
    pagination.reset(totalMovies);

    refs.gallery.innerHTML = markup;
    allProducts = [...getItems()];

    if (totalMovies === 0) {
      refs.paginationContainer.style.display = 'none';
    } else {
      refs.paginationContainer.style.display = 'block';
    }

  } catch (err) {
    console.log(err);
  } finally {
    spinnerStop()
  }
  event.target.reset();
};

refs.formEl.addEventListener('submit', onSearchFormSubmit);


//  -------------------  PAGINATION  --------------------

const page = pagination.getCurrentPage();

const loadMoreFavouritesMovies = async event => {

  const currentPage = event.page;
  try {
    spinnerPlay()
    const genresIds = await themoviedbAPI.fetchGenres();
    const trendMovies = await themoviedbAPI.fetchFavouritesMovies(currentPage);

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
    allProducts = [...getItems()];
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
};
const loadMoreMoviesByQuery = async event => {
  const currentPage = event.page;
  try {
    spinnerPlay();
    const searchMovies = await themoviedbAPI.fetchMoviesByQuery(currentPage);
    const markup = searchMovies.results.map(renderMarkup).join('');
    refs.gallery.innerHTML = markup;
    allProducts = [...getItems()];
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
};

pagination.on('beforeMove', loadMoreFavouritesMovies);


//THEME

// const Theme = {
//   LIGHT: 'light-theme',
//   DARK: 'dark-theme',
// };

// const THEME_STORAGE_KEY = 'theme';
// const inputRef = document.querySelector('.theme-switch__toggle');

// const load = key => {
//   try {
//     const serializedState = localStorage.getItem(key);
//     return serializedState === null ? undefined : JSON.parse(serializedState);
//   } catch (error) {
//     console.error('Get state error: ', error.message);
//   }
// };

// const save = (key, value) => {
//   try {
//     const serializedState = JSON.stringify(value);
//     localStorage.setItem(key, serializedState);
//   } catch (error) {
//     console.error('Set state error: ', error.message);
//   }
// };

// const initPage = () => {
//   const savedChecked = load(THEME_STORAGE_KEY);
//   inputRef.checked = savedChecked;
//   document.body.className = savedChecked ? Theme.DARK : Theme.LIGHT;
// };

// initPage();

// const onThemeSwitch = event => {
//   const { checked } = event.target;

//   document.body.className = checked ? Theme.DARK : Theme.LIGHT;
//   save(THEME_STORAGE_KEY, checked);
// };

// inputRef.addEventListener('change', onThemeSwitch);

// // SCROLL


// EMPTY GALLERY
// const main = document.querySelector('.main-container--gallery');

// export default function getWatched() {
//   const fromLSWatched = localStorage.getItem('watched');

//   // clearMain();
//   if (fromLSWatched === '[]' || fromLS === null) {
//     clearMain();
//     main?.classList.add('.perspective');
//     return refs.main.insertAdjacentHTML(
//       'afterbegin',
//       `<h1 class="js-title-queue preserve">Your list is empty...</h1>
//       <img src="./images/movie.png" alt="cinema" />
//       <div class="cloak__wrapper preserve">
//         <div class="cloak__container preserve">
//           <div class="cloak preserve"></div>
//         </div>
//       </div>`
//     );
//   }
//   main?.classList.remove('.perspective');
//   // clearMain();
//   const arrayFilms = JSON.parse(fromLSWatched);
//   arrayFilms.reverse();
//   renderMarkup(arrayFilms);
// }

// function clearMain() {
//   main.innerHTML = ' ';
// }
