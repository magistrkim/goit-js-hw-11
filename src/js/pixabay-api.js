// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'https://api.unsplash.com',
// });

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
      const searchParams = new URLSearchParams({
        ...this.#BASE_SEARCH_PARAMS,
        page: this.page,
        q: this.query,
      });
      return fetch(`${this.#BASE_URL}/api/?${searchParams}`).then(res => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      });
    }
  }
  

  // AXIOS
  // fetchPhotos() {
  //     return instance.get('/search/photos', {
  //       params: {
  //         query: this.query,
  //         page: this.page,
  //         per_page: 12,
  //         color: 'black_and_white',
  //         client_id: this.#API_KEY,
  //       },
  //     });
  //   }


