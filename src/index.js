import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import NewsService from './js/NewsService.js';
import LoadMoreBtn from './js/LoadMoreBtn.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const newsService = new NewsService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === '') alert('No value!');
  else {
    newsService.searchQuery = value;
    newsService.resetPage();

    loadMoreBtn.show();
    clearNewsList();
    fetchArticles().finally(() => form.reset());
  }
}

async function fetchArticles() {
	loadMoreBtn.disable();
  const curentPage = newsService.page;
  try {
    const articlesMarkup = await getArticlesMarkup();
    if (articlesMarkup === '') {
      throw new Error('No data');
		}
      if (curentPage === 1) {
        Notify.success(`Hooray! We found ${newsService.hits} images.`);
        loadMoreBtn.show();
        await getArticlesMarkup();
      }
		updateNewsList(articlesMarkup);
		if (newsService.page * 40 >= newsService.hits) {
      loadMoreBtn.hide();
      Notify.info("We're sorry, but you've reached the end of search results.");
		}
		initializeLightbox();
  } catch (err) {
    onError(err);
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  loadMoreBtn.enable();
}

async function getArticlesMarkup() {
  try {
    const articles = await newsService.getNews();

    if (!articles) {
      loadMoreBtn.hide();
      return '';
    }
    if (articles.length === 0) {
      throw new Error('No data');
    }

    return articles.reduce(
      (markup, article) => markup + createMarkup(article),
      ''
    );
  } catch (err) {
    onError(err);
    return '';
  }
}

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
    <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-img" />
    <div class="info">
      <p class="info-item"><b>Likes</b> ${likes}</p>
      <p class="info-item"><b>Views</b> ${views}</p>
      <p class="info-item"><b>Comments</b> ${comments}</p>
      <p class="info-item"><b>Downloads</b> ${downloads}</p>
    </div>
  </div>
</a>`;
}

function updateNewsList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearNewsList() {
  refs.gallery.innerHTML = '';
}

function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery__item', {
    captionDelay: 250,
    captionsData: 'alt',
    enableKeyboard: true,
  });
}


//! Infinite scroll
// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

//   if (scrollTop + clientHeight >= scrollHeight - 5) {
//     fetchArticles();
//   }
// }

// window.addEventListener("scroll", handleScroll);


