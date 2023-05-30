import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36828323-5d4b30a68db3a86c330ff5a61';

export default class NewsService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = 0;
  }

  async getNews() {
    try {
      const { data } = await axios.get(
        `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type='photo'&orientation='horizontal'&safesearch=true&page=${this.page}&per_page=40`
      );
      this.totalHits = data.totalHits;
      this.incrementPage();
      return data.hits;
    } catch (err) {
      console.error(err);
      Report.failure(
        'ERROR',
        'Sorry, there are no images matching your search query. Please try again.',
        'Ok'
      );
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get hits() {
    return this.totalHits;
  }

  set hits(newTotalHits) {
    this.totalHits = newTotalHits;
  }

  hasMorePhotos() {
    return this.page <= Math.ceil(this.totalHits / 40);
  }
}
