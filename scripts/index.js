// @todo: Темплейт карточки
const profileOpenButton = document.querySelector('.profile__open-button');  /* кнопка открывает попап-профайл*/
const profileAddButton = document.querySelector('.profile__add-button');    /* кнопка в профайле открывает попап для карточек*/

const popup = document.querySelectorAll('.popup');                      /*затемнение на попап-общий */
const popupForm = document.querySelector('.popup__form');
const popupButtonClose = document.querySelector('.popup__btn-close');   /*крестик закрытия попап-общий*/

const popupProfile = document.querySelector('.popup-profile');                      /* попап-профайл*/
const popupProfileBtnClose = document.querySelector('.popup-profile__btn-close');   /*крестик закрытия попап-профайл */
const popupProfileBtnSubmit = document.querySelector('.popup-profile__btn-submit'); /* кнопка submit попапа-профайл*/
const popupProfileForm = document.querySelector('.popup-profile__form');            /* форма попап-профайл*/

const profileInfoName = document.querySelector('.profile__info-name');      /*профайл*/
const profileInfoAbout = document.querySelector('.profile__info-about');    /*профайл*/

const popupAdd = document.querySelector('.popup-add');                      /* попап добавления карточки*/
const popupAddBtnClose = document.querySelector('.popup-add__btn-close');   /*крестик закрытия попапа-карточки */  
const popupAddBtnSubmit = document.querySelector('.popup-add__btn-submit');     /* кнопка submit попапа-карточки*/
const popupAddForm = document.querySelector('.popup-add__form');             /* форма попапа-карточки**/

const popupImg = document.querySelector('.popup-img');                      /* попап-img*/
const popupImgBtnClose = document.querySelector('.popup-img__btn-close');   /*крестик закрытия попап-img*/

const listContainer = document.querySelector('.places__list');
const template = document.querySelector('.card-template');

const popupPic = popupImg.querySelector('.popup__image');
const popupAlt = popupImg.querySelector('.popup__alt');

const inputName = document.querySelector('.input-name');    /*попап-профайл */
const inputAbout = document.querySelector('.input-about');  /*попап-профайл */

const inputTitle = document.querySelector('.input-title');  /*попап-карточки*/
const inputLink = document.querySelector('.input-link');    /*попап-карточки*/

const root = document.querySelector('.root'); /* общий для закрытия попапов */ 


// @todo: DOM узлы

function openPopup(arg){    /* общий открытие попапов*/
    arg.classList.add('popup_opened');

    root.addEventListener('click', closeOnOverlay);         /*закрытие по overlay */
    root.addEventListener('keydown', keyHandler);       /*закрытие по esc */
}

function closePopup(popup){   /*общий закрытие попапов*/
    popup.classList.remove('popup_opened');

    root.removeEventListener('click', closeOnOverlay);         /*закрытие по overlay */
    root.removeEventListener('keydown', keyHandler);       /*закрытие по esc */
}

function closeOnOverlay(e){     /*закрытие по overlay */
    if(e.target.classList.contains('popup')){
        e.target.classList.remove('popup_opened');
    };
}

function keyHandler(evt) {      /*закрытие по esc */
    const openedPopup = document.querySelector('.popup_opened');

  if(evt.key === 'Escape'){
    openedPopup.classList.remove('popup_opened');
   };
} 

function handleFormSubmit(event) {  /*попап-профайл отображение информации после подтверждения*/
    event.preventDefault();
    profileInfoName.textContent = inputName.value;
    profileInfoAbout.textContent = inputAbout.value;
    closePopup(popupProfile);
}


// @todo: Функция создания карточки
function bindAddItemListener() {    /*создание новой карточки */
    popupAddForm.addEventListener('submit', addNewItem);
}

function addNewItem(event) {     /*создание новой карточки */
    event.preventDefault();
    const inputText = inputTitle.value;
    const inputRef = inputLink.value; 
    const newItemCards = composeItem({name: inputText, link: inputRef})
    popupAddForm.reset();
    listContainer.prepend(newItemCards);
    closePopup(popupAdd);
}

// @todo: Функция удаления карточки
function removeItem(event){     /*удаление карточки */
    const targetItem = event.target.closest('.cards__item');
    targetItem.remove();
}

function openImage(item){   /*открытие попап-img*/
    popupPic.src = item.link;
    popupPic.alt = item.name;
    popupAlt.textContent = item.name;
    openPopup(popupImg);
}
// @todo: Вывести карточки на страницу

function renderList() {
    const listCards = initialCards.map(composeItem);
     
    listContainer.append(...listCards);
}

function composeItem(item){
    const newItem = template.content.querySelector('.card').cloneNode(true);
    const cardsImg = newItem.querySelector('.card__image');
    const cardsTitle = newItem.querySelector('.card__title')
    const cardsBtnRemove = newItem.querySelector('.card__delete-button');
    const cardsLike = newItem.querySelector('.card__like-button');
 
    cardsImg.src = item.link;
    cardsImg.alt = item.name;
    cardsTitle.textContent = item.name;
 
    cardsBtnRemove.addEventListener('click', removeItem);
 
    cardsLike.addEventListener('click', function (evt) {
    evt.target.classList.toggle('card__like-button_active');
    });
 
    cardsImg.addEventListener('click', function(){
    openImage(item);
    });
 
    return newItem;
}


profileOpenButton.addEventListener('click', function(){  /*попап-профайл открытие и отображение информации*/
    inputName.value = profileInfoName.textContent;
    inputAbout.value = profileInfoAbout.textContent;
    openPopup(popupProfile);
    enableValidation(validationConfig);
    checkError(popupProfile, validationConfig);
});

popupProfileForm.addEventListener('submit', handleFormSubmit); /* сабмит попап-профайл */

popupProfileBtnClose.addEventListener('click', function (){  /* закрытие попап-профайл */
    closePopup(popupProfile);
});

profileAddButton.addEventListener('click', function(){  /* открытие попап-карточки*/
    openPopup(popupAdd);
    document.querySelector('.popup-add__form').reset();
    checkError(popupAdd, validationConfig);
});

popupAddBtnClose.addEventListener('click', function (){  /* закрытие попап-карточки*/
    closePopup(popupAdd);
});

popupImgBtnClose.addEventListener('click', function (){ /* закрытие попап-img*/
    closePopup(popupImg);
});

bindAddItemListener();
renderList();