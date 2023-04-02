import PhotoApiService from './getPhotoApi';
import { Notify } from 'notiflix';
import axios from 'axios';

const formEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let allHits = 0;
const photoApiService = new PhotoApiService();

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.add('is-hidden');

function onSubmitForm(e) {
  e.preventDefault();
  resetPhotoList();
  photoApiService.searchQuery =
    e.currentTarget.elements.searchQuery.value.trim();

  if (photoApiService.searchQuery === '') {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  photoApiService.resetPageNum();
  photoApiService.getPhotos().then(({ hits, totalHits }) => {
    allHits = hits.length;
    if (hits.length >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    if (totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else createPhotoMarkup(hits);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    if (!totalHits <= photoApiService.per_page) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  });
}

function onLoadMore() {
  photoApiService.getPhotos().then(({ hits, totalHits }) => {
    createPhotoMarkup(hits);

    if (hits.length + allHits >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
    }
  });
}

function createPhotoMarkup(photos) {
  galleryListEl.insertAdjacentHTML(
    'beforeend',
    photos
      .map(photo => {
        return ` <div class="photo-card">
      <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy"  />

      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${photo.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${photo.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${photos.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${photo.downloads}
        </p>
      </div>
    </div>`;
      })
      .join('')
  );
}

function resetPhotoList() {
  galleryListEl.innerHTML = '';
}
