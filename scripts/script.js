// location

const headerCityButton = document.querySelector('.header__city-button');

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город');
    headerCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
})


// blocking scroll


const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth;

    document.body.dbScrollY = window.scrollY;

    document.body.style.cssText = `
        position: fixed;
        top: ${-document.body.dbScrollY}px;
        left: 0;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px;
    `;

}

const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    })
}




// modal window

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        enableScroll();
    }
})

const subheaderCart = document.querySelector('.subheader__cart'),
    cartOverlay = document.querySelector('.cart-overlay');

const closeModal = () => {
    cartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
}
const openModal = () => {
    cartOverlay.classList.add('cart-overlay-open');
    disableScroll();
}

subheaderCart.addEventListener('click', openModal);

cartOverlay.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        closeModal();
    }
});



