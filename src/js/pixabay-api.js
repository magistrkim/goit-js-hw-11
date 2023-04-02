import axios from 'axios';

export class PixabayAPI {
  #API_KEY = '34895141-e919cbae75dc4f78133336abf';
  #BASE_URL = 'https://pixabay.com/';
  #BASE_SEARCH_PARAMS = {
    per_page: 40,
    image_type: 'photo',
    key: this.#API_KEY,
    orientation: 'horizontal',
    safesearch: true,
  };

  query = '';
  page = 1;

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}/api/?`, {
      params: {
        ...this.#BASE_SEARCH_PARAMS,
        page: this.page,
        q: this.query,
      },
    });
  }
}
