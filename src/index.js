import NewsService from './js/NewsService.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const newsService = new NewsService();

refs.form.addEventListener('submit', onSubmit);

function createMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
	return `<a class="gallery__item" href="${largeImageURL}">
	<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes</b> ${likes}</p>
      <p class="info-item"><b>Views</b> ${views}</p>
      <p class="info-item"><b>Comments</b> ${comments}</p>
      <p class="info-item"><b>Downloads</b> ${downloads}</p>
    </div>
  </div>
</a>`;
}
