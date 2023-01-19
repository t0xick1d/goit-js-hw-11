import { getAllActualPictures } from './apiAxios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  picture: document.querySelector('.gallery'),
  btnTakeMorePictures: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmtForm);
refs.btnTakeMorePictures.addEventListener('click', onClickTakePictures);

let lastResponseOnAxios = '';
let actualPage = 2;

async function onSubmtForm(e) {
  e.preventDefault();
  const currentValue = e.target[0].value;
  if (currentValue === '') {
    cleanGaleryList(currentValue);
    return;
  }
  lastResponseOnAxios !== currentValue && (refs.picture.innerHTML = '');

  const responsPictures = await getAllActualPictures(currentValue);

  showNotfication(responsPictures.data, currentValue);

  galleryListMarkUp(responsPictures);
  refs.btnTakeMorePictures.style.display = 'block';
}

async function onClickTakePictures(e) {
  const actualValueCollection = refs.form[0].value;
  if (lastResponseOnAxios === actualValueCollection) {
    const responsPictures = await getAllActualPictures(
      actualValueCollection,
      actualPage
    );
    actualPage += 1;
    galleryListMarkUp(responsPictures);
  } else {
    actualPage = 1;
    const responsPictures = await getAllActualPictures(
      actualValueCollection,
      actualPage
    );
    refs.picture.innerHTML = '';
    galleryListMarkUp(responsPictures);
  }
}

function galleryListMarkUp(gallery) {
  const galleryList = gallery.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                  <a href=${largeImageURL}>
                    <img src="${webformatURL}" alt="${tags}" loading="lazy" height="210"/>
                    <div class="info">
                      <p class="info-item">
                        <b class="info-item-title" >Likes</b>
                        <b>${likes}</b>
                      </p>
                      <p class="info-item">
                        <b class="info-item-title">Views</b>
                        <b>${views}</b>
                      </p>
                      <p class="info-item">
                        <b class="info-item-title">Comments</b>
                        <b>${comments}</b>
                      </p>
                      <p class="info-item">
                        <b class="info-item-title">Downloads</b>
                        <b>${downloads}</b>
                      </p>
                    </div>
                    </a>
                </div>`;
      }
    )
    .join(' ');
  refs.picture.insertAdjacentHTML('beforeend', galleryList);
  new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}
function showNotfication(value, currentValue) {
  if (value.total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    Notify.success(`Hooray! We found ${value.totalHits} images.`);
    lastResponseOnAxios = currentValue;
  }
}

function cleanGaleryList() {
  refs.picture.innerHTML = '';
  refs.btnTakeMorePictures.style.display = '';
}
