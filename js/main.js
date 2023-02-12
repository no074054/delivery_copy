
'use strict';

new WOW().init();

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");

const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');

const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModal() {
    modal.classList.toggle("is-open");
    if(modal.classList.contains("is-open")) {
        disableScroll();
    } else {
        enableScroll();
    }
}

function toggleModalAuth() {
    modalAuth.classList.toggle("modal-auth-display");

    loginInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    if(modalAuth.classList.contains("modal-auth-display")) {
        disableScroll();
    } else {
        enableScroll();
    }
}

function authorized() {
    console.log('Авторизован');

    function logOut() {
        login = null;
        localStorage.removeItem('gloDelivery');

        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';

        buttonOut.removeEventListener('click', logOut);

        checkAuth();
    }

    userName.textContent = login;

    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
    console.log('Не авторизован');

    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;

        if(login.trim() && passwordInput.value.trim()) { // if(login != '' && passwordInput.value != '') {
            localStorage.setItem('gloDelivery', login);

            toggleModalAuth();
    
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
    
            logInForm.reset();
    
            checkAuth();
        } else {
            loginInput.style.borderColor = '#ff0000';
            passwordInput.style.borderColor = '#ff0000';
            alert('Введите логин и пароль');
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);

    logInForm.addEventListener('submit', logIn);

    modalAuth.addEventListener('click', function (event) {
        if(event.target.classList.contains('modal-auth-display')) {
            toggleModalAuth();
        }
    });
}

function checkAuth() {
    if(login) {
        authorized();
    } else {
        notAuthorized();
    }
}

checkAuth();


function createCardRestaurant() {
    const card = `
        <div class="card">
            <a>
                <img src="img/image2.png" alt="image" class="card-image">
            </a>
            <div class="card-text">
                <div class="card-heading">
                    <a>
                        <h3 class="card-title">Тануки</h3>
                    </a>
                    <span class="card-tag tag">60 мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        <img src="img/rating.svg" alt="rating">
                        4.5
                    </div>
                    <div class="price">От 1 200 $</div>
                    <div class="category">Суши, роллы</div>
                </div>
            </div>
        </div>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

function createCardGood() {
    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="img/image6.png" alt="image" class="card-image-restaurant">
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">Пицца Гавайская</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">Соус томатный, сыр "Моцарела", ветчина, ананасы</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary">
                    <span class="button-card-text">В корзину</span>
                    <img src="img/shopping2.svg">
                </button>
                <strong class="card-price-bold">250 $</strong>
            </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    const target = event.target;
    const restaurant = target.closest('.card');

    if(restaurant) {
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
    }

    cardsMenu.textContent = '';

    createCardGood();
    createCardGood();
    createCardGood();
}

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});



cartButton.addEventListener('click', toggleModal);

close.addEventListener('click', toggleModal);

modal.addEventListener('click', function (event) {
    if(event.target.classList.contains('is-open')) {
        toggleModal();
    }
});