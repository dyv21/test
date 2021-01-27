const body = document.querySelector('.page-body');
const header = body.querySelector('.page-header');
const footer = body.querySelector('.page-footer');
const imgList = body.querySelectorAll('.img-list__img');
const navMain = header.querySelector('.main-nav');
const navToggle = navMain.querySelector('.main-nav__toggle');
const fragment = document.createDocumentFragment();

navToggle.addEventListener('click', () => {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    header.style = `margin-bottom: 65px`;
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    header.removeAttribute('style');
  }
});

const createCloseButton = () => {
  const closeElement = document.createElement('button');
  closeElement.classList.add('modal__btn');
  closeElement.type = 'button';
  closeElement.ariaLabel = 'Закрыть окно';
  fragment.append(closeElement);
  return closeElement;
};

const createModal = () => {
  const modalElement = document.createElement('div');
  modalElement.classList.add('modal');

  const modalWindowElement = document.createElement('div');
  modalWindowElement.classList.add('modal__window');

  modalElement.append(modalWindowElement, createCloseButton());
  footer.insertAdjacentElement('afterend', modalElement);
};

document.addEventListener('DOMContentLoaded', createModal());

const modal = body.querySelector('.modal');
const modalWindow = modal.querySelector('.modal__window');
const closeButton = modal.querySelector('.modal__btn');

const createImg = (i) => {
  const imgElement = document.createElement('img');
  imgElement.src = `img/img-${i}.jpg`;
  imgElement.alt = `Увеличная картинка ${i}`;
  imgElement.classList.add('modal__img');
  modalWindow.dataset.index = i;
  fragment.append(imgElement);
  return fragment;
};

imgList.forEach((img, i) => {
  img.addEventListener('click', () => {
    modal.classList.add('modal--show');
    modalWindow.append(createImg(i + 1));
  });
});

const clearModal = () => {
  modal.classList.remove('modal--show');
  modalWindow.innerHTML = '';
};

closeButton.addEventListener('click', clearModal);

modal.addEventListener('click', (evt) => {
  if (!evt.target.closest('.modal__window')) {
    if (modal.classList.contains('modal--show')) {
      clearModal();
    }
  }
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    if (modal.classList.contains('modal--show')) {
      clearModal();
    }
  }
});
