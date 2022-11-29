import { themoviedbAPI } from '../index'

export function renderGenres(movie) {
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
    if (genresName.length === 0) {
        genresName.push('Other');
    }
    return genresName.join(', ');
}
