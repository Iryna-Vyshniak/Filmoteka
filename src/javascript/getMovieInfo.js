export const getOneMovieInfo = movieInfo => {
  const id = movieInfo?.id;
  const title = movieInfo?.title;
  let posterUrl = movieInfo?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`
    : `https://astoriamuseums.org/wp-content/uploads/2020/10/OFM-poster-not-available.png`;

  if (
    movieInfo?.vote_count < 10 &&
    (movieInfo?.original_title.charCodeAt(0) > 12000 ||
      movieInfo?.original_title.charCodeAt(
        movieInfo?.original_title.length - 1
      ) > 12000)
  ) {
    posterUrl = `${korean}`;
  }

  let genres = [];

  movieInfo.genres.forEach(genre => {
    genres.push(genre.name);
  });
  genres = genres.join(', ');

  let year = '';
  if (movieInfo?.release_date) {
    year = movieInfo.release_date?.length
      ? movieInfo?.release_date.slice(0, 4)
      : '';
  }
  let vote_average = 0;
  if (movieInfo?.vote_average) {
    vote_average = movieInfo.vote_average.toFixed(2);
  }
  const noImage = `https://astoriamuseums.org/wp-content/uploads/2020/10/OFM-poster-not-available.png`;
  return { title, posterUrl, genres, year, id, noImage, vote_average };
};
