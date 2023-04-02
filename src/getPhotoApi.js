import axios from 'axios';
export default class PhotoApiService {
  constructor() {
    this.API_KEY = '34883427-fe70cd3747fe88c31215abbc1';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  getPhotos() {
    const searchParams = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    });

    return fetch(
      `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&${searchParams}`
    )
      .then(response => response.json())
      .then(data => {
        this.incrementPageNum();

        return data;
      });
  }
  incrementPageNum() {
    this.page += 1;
  }
  resetPageNum() {
    this.page = 1;
  }
}
