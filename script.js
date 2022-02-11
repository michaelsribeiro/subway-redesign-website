AOS.init();

// => Animation Loop buyButton
$(document).ready( () => {
    let button = document.querySelector('.nav-bar a:last-child');
    setInterval( () => {        
        if (button.classList.contains('animation')) {
            document.querySelector('.nav-bar a:last-child').classList.remove('animation');
        } else {        
            button.classList.add('animation');
        }
    }, 3500);

});

// => Scroll to section animation
const buyButton = document.querySelector('.nav-bar a:last-child');

buyButton.addEventListener('click', scrollOnClick);

function getScrollTopByHref(element) {
    const id = element.getAttribute('href');
    return document.querySelector(id).offsetTop;
}

function scrollOnClick(event) {
    event.preventDefault();
    const element = event.target;
    const to = getScrollTopByHref(event.target) - 80;
    scrollToPosition(to);
}

function scrollToPosition(to) {
    window.scroll({
        top: to,
        behavior: "smooth",
    });
}

// => Carousel
let currentSlide = 0;
let totalSlides = document.querySelectorAll('.carousel-item').length;
document.querySelector('.carousel-inner').style.width = `calc(100vw * ${totalSlides})`;
document.querySelector('.carousel-dots').style.height = `${document.querySelector('.carousel').clientHeight}px`;

function goPrev() {
    currentSlide--;
    if (currentSlide < 0) {currentSlide = totalSlides - 1;}
    updateMargin();
}
function goNext() {
    currentSlide++;
    if (currentSlide > (totalSlides - 1)) {currentSlide = 0;}
    updateMargin();
}

function updateMargin() {
    let sliderWidth = document.querySelector('.carousel-item').clientWidth;
    let newMargin = (currentSlide * sliderWidth);
    document.querySelector('.carousel-inner').style.marginLeft = `-${newMargin}px`;
}
setInterval(goNext, 8000);

// => Sandwiches section
let cart = [];
let quant = 1;
let pizzaKey = 0;

pizzaJson.map( (item, index) => {
    const pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} (${item.sizes[0]})`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();

        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        quant = 1;
        pizzaKey = key;

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');

        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 1) size.classList.add('selected');
        });

        document.querySelector('.pizzaInfo--qt').innerHTML = quant;

        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {            
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    document.querySelector('.pizza-area').append( pizzaItem );
});

function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 200);
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {
    item.addEventListener('click', closeModal);
});

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    quant > 1 ? quant -= 1 : quant;
    document.querySelector('.pizzaInfo--qt').innerHTML = quant;
});

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    quant++;
    document.querySelector('.pizzaInfo--qt').innerHTML = quant;
});

document.querySelectorAll('.pizzaInfo--size').forEach( (size) => {
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[pizzaKey].id + '-' + size;
    let key = cart.findIndex( (item) => item.identifier == identifier);

    if ( key > -1 ) {
        cart[key].qtCart += quant; // => Se já houver um item no carrinho com o mesmo identifier, add a quant.
    } else {
        cart.push({
            identifier,
            id: pizzaJson[pizzaKey].id,
            size,
            qtCart: quant,
            price: pizzaJson[pizzaKey].price,
        });
    }
    closeModal();
    updateCart();
});

document.querySelector('.cartsection .menu-closer').addEventListener('click', () => {
    document.querySelector('.cartsection').classList.remove('show');
});

function updateCart() {
    if (cart.length > 0) {
        document.querySelector('.cartsection').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        let total = 0;
        let totalItem = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id );
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            total += pizzaItem.price * cart[i].qtCart;
            totalItem += cart[i].price * cart[i].qtCart;

            console.log(cart[i].price);

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaItem.name;
            cartItem.querySelector('.cart--item-price').innerHTML = `${pizzaItem.price.toLocaleString('pt-br',{ style:'currency', currency: 'BRL' })}`;

            document.querySelector('.cart').append( cartItem );
        }

        document.querySelector('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{ style:'currency', currency: 'BRL' })}`;
    } else {
        document.querySelector('.cartsection').classList.remove('show');
        document.querySelector('.cartsection').style.left = '100vw';
    }
}