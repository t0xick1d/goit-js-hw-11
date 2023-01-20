import { getAllActualPictures } from './apiAxios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

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

  switchShowBtnMoreLoading(responsPictures.data.totalHits);
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

    switchShowBtnMoreLoading(responsPictures.data.totalHits);
  } else {
    actualPage = 1;
    const responsPictures = await getAllActualPictures(
      actualValueCollection,
      actualPage
    );
    refs.picture.innerHTML = '';
    galleryListMarkUp(responsPictures);

    switchShowBtnMoreLoading(responsPictures.data.totalHits);
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
  simpleLightBox.refresh();
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

function switchShowBtnMoreLoading(totalHits) {
  const showBtnLoadMore = actualPage <= Math.ceil(totalHits / 40);
  showBtnLoadMore
    ? (refs.btnTakeMorePictures.style.display = 'block')
    : (refs.btnTakeMorePictures.style.display = 'none');
}