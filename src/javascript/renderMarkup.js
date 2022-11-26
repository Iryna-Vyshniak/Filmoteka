import * as basicLightbox from 'basiclightbox';

export function renderMarkup(data) {
  const { id, genre_ids, poster_path, original_title, release_date } = data;
  const posterPath = data.poster_path
    ? `https://image.tmdb.org/t/p/w300${poster_path}`
    : `https://astoriamuseums.org/wp-content/uploads/2020/10/OFM-poster-not-available.png`;
  const releaseYear = new Date(Date.parse(release_date)).getFullYear();

  return `<li class="gallery__item movie-card" data-id="${id}">
                  <div class="movie-card__poster-container">
                    <img src="${posterPath}"
                        class="movie-card__poster"
                        alt="${original_title}"
                                            />
                  </div>
                  <div class="movie-card__thumb">
                      <h2 class="movie-info-title"> ${original_title}</h2>
                      <div class="movie-info-list">
                        <span class="info-item-slash"> | </span>
                        <p class="info-item-year">${releaseYear}</p>
                      </div>
                  </div>
            </li>`;
}

export function createModalMarkUp({
  id,
  poster,
  title,
  originalTitle,
  genres,
  popularity,
  overview,
  vote_average,
  vote_count,
}) {
  const instance = basicLightbox.create(
    `
   <div class="lightbox-modal">
   <button
      data-map-close
      class="lightbox-modal__close-btn"
      aria-label="close modal window"
    >&#10005;
    </button>
<div class="lightbox-modal__img-wrapper">
 <img class="lightbox-modal__image"
  src="${poster}"
  alt="${title}"/>
</div>

<div class="lightbox-modal__data">
<p class="lightbox-modal__title" data-title>${title}</p>

<div class="lightbox-modal__meta">
<div class="lightbox-modal__meta-title">
<ul class="lightbox-modal__meta-title-list">
<li class="lightbox-modal__meta-title-list-item">Vote / Votes</li>
<li class="lightbox-modal__meta-title-list-item">Popularity</li>
<li class="lightbox-modal__meta-title-list-item">Original Title</li>
<li class="lightbox-modal__meta-title-list-item">Genre</li>
</ul>
</div>

<div class="lightbox-modal__meta-value">
<ul class="lightbox-modal__meta-value-list">
<li class="lightbox-modal__meta-value-list-item"><span class="lightbox-modal__meta-value-vote" data-vote>${vote_average}</span><span class="lightbox-modal__meta-value-votes-divider">/</span><span class="lightbox-modal__meta-value-votes" data-votes>${vote_count}</span></li>
<li class="lightbox-modal__meta-value-list-item"><span data-popularity>${popularity}</span></li>
<li class="lightbox-modal__meta-value-list-item"><span class="lightbox-modal__meta-value-title" data-original-title>${originalTitle}</span></li>
<li class="lightbox-modal__meta-value-list-item"><span data-genre>${genres}</span></li>
</ul>
</div>
</div>

<p class="lightbox-modal__description">
<span class="lightbox-modal__description-title">About</span>
${overview}
</p>

<div class="lightbox-modal__buttons">
<button type="button" class="lightbox-modal__watched-button" data-id="${id}">Add to Watched</button>
<button type="button" class="lightbox-modal__queque-button" data-id="${id}">Add to queue</button>
</div>

</div>`,
    {
      onShow: instance => {
        instance.element().querySelector('.lightbox-modal__close-btn').onclick =
          instance.close;
        window.addEventListener('keydown', event => {
          if (event.code === 'Escape' || event.code === 'Space') {
            instance.close();
            window.removeEventListener;
          }
        });
      },
      onClose: instance => {},
    }
  );
  instance.show();
}
