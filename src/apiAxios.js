const axios = require('axios').default;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32947262-816ad506c9db86c30ae5e3e11';
const params = {
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

export function getAllActualPictures(value, actualPage = 1) {
  return axios.get(BASE_URL, {
    params: { ...params, q: value, page: actualPage },
  });
}
