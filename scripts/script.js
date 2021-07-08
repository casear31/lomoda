// location

const headerCityButton = document.querySelector('.header__city-button');

//hash (category)
let hash = location.hash.substring(1);

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



// query to DB

const getData = async () => {
    const data = await fetch('db.json');

    if (data.ok) {
        return data.json();
    } else {
        throw new Error(`Данные не были получены, ошибка: ${data.status} ${data.statusText}`)
    }
}

const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value))
            } else {
                callback(data);
            }
            
        })
        .catch(err => {
            console.error(err);
        });
};


    
//move here from modal window
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        enableScroll();
    }
})

subheaderCart.addEventListener('click', openModal);

cartOverlay.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
        closeModal();
    }
});



// output goods on the page

try {
    const goodsList = document.querySelector('.goods__list');

    if (!goodsList) {
        throw 'This is not a goods page'
    }

    const createCard = ({ id, preview, cost, brand, name, sizes }) => {

// the same as   data -> callback
        // const id = data.id,
        //     preview = data.preview,
        //     cost = data.cost,
        //     brand = data.brand,
        //     name = data.name,
        //     sizes = data.sizes;


        const li = document.createElement('li');

        li.classList.add('goods__item');

        li.innerHTML = `
            <article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src="goods-image/${preview}" alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} &#8381;</p>
                                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                                ${sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : ''}
                                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                            </div>
                        </article>
        `;

        return li;
    };
    const renderGoodsList = data => {
        goodsList.textContent = '';
        
        data.forEach(item => {
            const card = createCard(item);

            goodsList.append(card);
        });

    };
    
    
    
    window.addEventListener('hashchange', () => {
        
        const categoryTitle = document.querySelector('.goods__title');

        hash = location.hash.substring(1);

        categoryTitle.textContent = document.querySelector(`a[href*="#${hash}"]`).textContent;
        getGoods(renderGoodsList, hash);
    })

    getGoods(renderGoodsList);


    
} catch(err) {
    console.warn(err)
    
}
