import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { PixabayAPI } from './pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchFormEl = document.querySelector('.js-search-form');
const galleryListEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');
const searchInputEl = searchFormEl.elements['searchQuery'];
const gallery = new SimpleLightbox('.gallery a');

const createGalleryCards = cards => {
  return cards
    .map(card => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = card;
      return `
      <div class="gallery_wrapper">
        <a class="photo-card" href="${largeImageURL}">
          <img class="gallery__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="gallery__info">
          <p class="info-item">
          <b>Likes: <span class="gallery__data">${likes}</span></b>
          </p>
          <p class="info-item">
          <b>Views: <span class="gallery__data">${views}</span></b>
          </p>
          <p class="info-item">
          <b>Comments: <span class="gallery__data">${comments}</span></b>
          </p>
          <p class="info-item">
          <b>Downloads: <span class="gallery__data">${downloads}</span></b>
          </p>
        </div> 
      </div>
      `;
    })
    .join('');
};
const pixabayAPI = new PixabayAPI();

const handleSearchPhotos = async event => {
  event.preventDefault();
  const searchQuery = event.target.elements['searchQuery'].value.trim();
  if (searchQuery === '') {
    return;
  }
  pixabayAPI.query = searchQuery;
  pixabayAPI.page = 1;
  try {
    const { data } = await pixabayAPI.fetchPhotos();
    if (!data.hits.length) {
      throw new Error();
    }
    galleryListEl.innerHTML = createGalleryCards(data.hits);
    gallery.refresh();
    if (data.totalHits > data.hits.length) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  } catch (error) {
    loadMoreBtnEl.classList.add('is-hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};
const handleLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;
  try {
    const { data } = await pixabayAPI.fetchPhotos();
    if (data.hits < pixabayAPI.page) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtnEl.classList.add('is-hidden');
    }
    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .lastElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  gallery.refresh();
};
const handleSearchInput = event => {
  const searchInputValue = event.target.value.trim();
  if (searchInputValue === '') {
    galleryListEl.innerHTML = '';
    loadMoreBtnEl.classList.add('is-hidden');
    pixabayAPI.query = '';
    pixabayAPI.page = 1;
  }
};

searchInputEl.addEventListener('input', handleSearchInput);
searchFormEl.addEventListener('submit', handleSearchPhotos);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
