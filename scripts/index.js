import { getUserInfo, setUserInfo, getCardList, updateAvatar, addCard, deleteCard, changeLikeCardStatus } from "./api.js";

let currentUserId;

// DOM
const profileOpenButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const popupProfile = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImg = document.querySelector('.popup_type_image');

const popupProfileForm = popupProfile.querySelector('.popup__form');
const popupAddForm = popupAdd.querySelector('.popup__form');

const profileInfoName = document.querySelector('.profile__title');
const profileInfoAbout = document.querySelector('.profile__description');

const listContainer = document.querySelector('.places__list');
// const template = document.querySelector('#card-template');
const template = document.querySelector('.template').content;
const popupPic = popupImg.querySelector('.popup__image');
const popupAlt = popupImg.querySelector('.popup__caption');

const inputName = popupProfile.querySelector('.popup__input_type_name');
const inputAbout = popupProfile.querySelector('.popup__input_type_description');

const inputTitle = popupAdd.querySelector('.popup__input_type_card-name');
const inputLink = popupAdd.querySelector('.popup__input_type_url');

// POPUPS
function openPopup(popup){
    popup.classList.add('popup_opened');
}

function closePopup(popup){
    popup.classList.remove('popup_opened');
}

// IMAGE
const openImage = (item) => {
    popupPic.src = item.link;
    popupPic.alt = item.name;
    popupAlt.textContent = item.name;
    openPopup(popupImg);
};

// ===== API HANDLERS =====

// лайк
function handleLikeCard(button, likeCount, cardId) {
  const isLiked = button.classList.contains('card__like-button_active');

  changeLikeCardStatus(cardId, !isLiked)
    .then((res) => {
      likeCount.textContent = res.likes.length;
      button.classList.toggle('card__like-button_active');
    })
    .catch(console.log);
}

// удаление
function handleDeleteCard(cardElement, cardId) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(console.log);
}

// добавление карточки
function handleAddCard(event) {
  event.preventDefault();

  addCard({
    name: inputTitle.value,
    link: inputLink.value
  })
    .then((newCard) => {
      const card = createCard(newCard);
      listContainer.prepend(card);
      popupAddForm.reset();
      closePopup(popupAdd);
    })
    .catch(console.log);
}

// профиль
function handleProfileSubmit(event) {
  event.preventDefault();

  setUserInfo({
    name: inputName.value,
    about: inputAbout.value
  })
    .then((userData) => {
      profileInfoName.textContent = userData.name;
      profileInfoAbout.textContent = userData.about;
      closePopup(popupProfile);
    })
    .catch(console.log);
}

// ===== CARD =====

function createCard(item) {
    //const newItem = template.content.querySelector('.card').cloneNode(true);
    const newItem = template.querySelector('.card').cloneNode(true);
    const cardsImg = newItem.querySelector('.card__image'); 
    const cardsTitle = newItem.querySelector('.card__title');
    const cardsBtnRemove = newItem.querySelector('.card__delete-button');
    const cardsLike = newItem.querySelector('.card__like-button');
    const likeCount = newItem.querySelector(".card__like-count");

    cardsImg.src = item.link;
    cardsImg.alt = item.name;
    cardsTitle.textContent = item.name;

    likeCount.textContent = item.likes.length;

    // активный лайк
    if (item.likes.some(user => user._id === currentUserId)) {
      cardsLike.classList.add('card__like-button_active');
    }

    // удаление только своих
    if (item.owner._id !== currentUserId) {
      cardsBtnRemove.remove();
    } else {
      cardsBtnRemove.addEventListener("click", () => handleDeleteCard(newItem, item._id));
    }

    cardsLike.addEventListener("click", () => handleLikeCard(cardsLike, likeCount, item._id));
    cardsImg.addEventListener("click", () => openImage(item));

    return newItem;
}

// ===== INIT =====

profileOpenButton.addEventListener('click', () => {
    inputName.value = profileInfoName.textContent;
    inputAbout.value = profileInfoAbout.textContent;
    openPopup(popupProfile);
});

profileAddButton.addEventListener('click', () => {
    openPopup(popupAdd);
});

popupProfileForm.addEventListener('submit', handleProfileSubmit);
popupAddForm.addEventListener('submit', handleAddCard);

// загрузка данных
Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    profileInfoName.textContent = userData.name;
    profileInfoAbout.textContent = userData.about;

    cards.forEach((item) => {
      listContainer.append(createCard(item));
    });
  })
  .catch(console.log);