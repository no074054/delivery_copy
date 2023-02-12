
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

const inputSearch = document.querySelector('.input-search');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.restaurant-rating');
const restaurantPrice = document.querySelector('.restaurant-price');
const restaurantCategory = document.querySelector('.restaurant-category');

let login = localStorage.getItem('gloDelivery');


const getData = async function (url) {
    const response = await fetch(url);

    if(!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
    }

    return response.json();

    // console.log(response.json());
}

getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
});


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


function createCardRestaurant(restaurant) {
    // console.log(restaurant);

    const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

    const card = `
        <div class="card" data-products="${products}">
            <a>
                <img src="${image}" alt="image" class="card-image">
            </a>
            <div class="card-text">
                <div class="card-heading">
                    <a>
                        <h3 class="card-title">${name}</h3>
                    </a>
                    <span class="card-tag tag">${timeOfDelivery} мин</span>
                </div>
                <div class="card-info">
                    <div class="rating">
                        <img src="img/rating.svg" alt="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} $</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </div>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood(goods) {
    // console.log(goods);

    const { description, image, name, price } = goods;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image-restaurant">
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary">
                    <span class="button-card-text">В корзину</span>
                    <img src="img/shopping2.svg">
                </button>
                <strong class="card-price-bold">${price} $</strong>
            </div>
        </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
    if(login) {
        const target = event.target;
        const restaurant = target.closest('.card');
        
        if(restaurant) {
            // console.log(restaurant.dataset.products);

            cardsMenu.textContent = '';
            
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood);
            });
        }
    } else {
        toggleModalAuth();
    }
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


new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'cube',     // effect: 'flip',
    grabCursor: true,
    cubeEffect: {
        shadow: false,
    }
});


inputSearch.addEventListener('keypress', function (event) {
    // console.log(event.charCode);

    if(event.charCode == 13) {
        const value = event.target.value.trim();

        if(!value) {
            event.target.style.backgroundColor = 'red';
            event.target.value = '';
            setTimeout(function () {
                event.target.style.backgroundColor = '';
            }, 1500);
            return;
        }

        getData('./db/partners.json')
            .then(function (data) {
                return data.map(function (partner) {
                    return partner.products;
                });
            })
            .then(function (linksProduct) {
                // console.log(linksProduct);
                cardsMenu.textContent = '';

                linksProduct.forEach(function (link) {
                    getData(`./db/${link}`)
                        .then(function (data) {
                            const resultSearch = data.filter(function (item) {
                                const name = item.name.toLowerCase();
                                return name.includes(value.toLowerCase());
                            });

                            containerPromo.classList.add('hide');
                            restaurants.classList.add('hide');
                            menu.classList.remove('hide');

                            restaurantTitle.textContent = "Результаты поиска";
                            restaurantRating.textContent = "";
                            restaurantPrice.textContent = "";
                            restaurantCategory.textContent = "";

                            resultSearch.forEach(createCardGood);
                        });
                });
            });
    }
});