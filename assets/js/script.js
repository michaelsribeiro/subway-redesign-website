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

// => Open and Close Menu Mobile
const toggleMenu = document.querySelector('.toggle');
toggleMenu.addEventListener('click', () => {
    let menuMobile = document.querySelector('.header-menu');
    if (menuMobile.classList.contains('showMenuMobile')) {
        menuMobile.classList.remove('showMenuMobile');
        this.classList.add('showMenuMobile');
    } else {
        menuMobile.classList.add('showMenuMobile');
    }

    document.querySelectorAll('.nav-button').forEach((item) => {
        item.addEventListener('click', () => {
            menuMobile.classList.remove('showMenuMobile');
        });
    });
});

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

let links = document.querySelectorAll('.nav-button, .footer-button');
links.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
    });
});

subwayJson.map( (item, index) => {
    const subwayItem = document.querySelector('.models .product').cloneNode(true);
    subwayItem.setAttribute('data-key', index);
    subwayItem.querySelector('.product--img img').src = item.img;
    subwayItem.querySelector('.product--price').innerHTML = `${item.price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} (${item.sizes[0]})`;
    subwayItem.querySelector('.product--name').innerHTML = item.name;
    subwayItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('html').style.overflow = 'hidden';
        let key = event.target.closest('.product').getAttribute('data-key');
        quant = 1;
        pizzaKey = key;        $('input[type=checkbox]').prop('checked',false);
        document.querySelector('.productImgBig img').src = subwayJson[key].img;
        document.querySelector('.productInfo h1').innerHTML = subwayJson[key].name;
        document.querySelector('.productInfo--desc').innerHTML = subwayJson[key].description;
        document.querySelector('.productInfo--actualPrice').innerHTML = `${subwayJson[key].price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        document.querySelector('.productInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.productInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 0) size.classList.add('selected');
        });
        document.querySelector('.productInfo--qt').innerHTML = quant;
        document.querySelector('.modalArea').style.opacity = 0;
        document.querySelector('.modalArea').style.display = 'flex';
        setTimeout(() => {            
            document.querySelector('.modalArea').style.opacity = 1;
        }, 200);
    });
    document.querySelector('.product-area').append( subwayItem );
});

function closeModal() {
    document.querySelector('.modalArea').style.opacity = 0;
    setTimeout( () => {
        document.querySelector('.modalArea').style.display = 'none';
    }, 200);
    document.querySelector('html').style.overflow = 'visible';
}

document.querySelectorAll('.productInfo--cancelButton, .productInfo--cancelMobileButton').forEach( (item) => {
    item.addEventListener('click', closeModal);
});

document.querySelector('.productInfo--qtmenos').addEventListener('click', () => {
    quant > 1 ? quant -= 1 : quant;
    document.querySelector('.productInfo--qt').innerHTML = quant;
});

document.querySelector('.productInfo--qtmais').addEventListener('click', () => {
    quant++;
    document.querySelector('.productInfo--qt').innerHTML = quant;
});

document.querySelectorAll('.productInfo--size').forEach( (size, sizeIndex) => {
    size.addEventListener('click', () => {
        document.querySelector('.productInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');        
        if (sizeIndex === 0){
            document.querySelector('.productInfo--actualPrice').innerHTML = `${subwayJson[pizzaKey].price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        } else {                      
            document.querySelector('.productInfo--actualPrice').innerHTML = `${subwayJson[pizzaKey].price[1].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        }
    });
});

document.querySelector('.productInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.productInfo--size.selected').getAttribute('data-key'));
    let identifier = subwayJson[pizzaKey].id + '-' + size;
    let key = cart.findIndex( (item) => item.identifier == identifier);
    if ( key > -1 ) {
        cart[key].qtCart += quant; // => Se já houver um item no carrinho com o mesmo identifier, add a quant.
    } else {
        cart.push({
            identifier,
            id: subwayJson[pizzaKey].id,
            size,
            qtCart: quant,
            price: subwayJson[pizzaKey].price,
        });
    }
    closeModal();
    updateCart();
});

document.querySelector('.cartsection .cart--backBtn').addEventListener('click', () => {
    document.querySelector('.cartsection').classList.remove('show');
});

document.querySelector('.cartBtnMobile').addEventListener('click', (event) => {
    event.preventDefault(); 
    updateCart();
});

document.querySelector('.cartBtn').addEventListener('click', (event) => {
    event.preventDefault(); 
    updateCart();
});

function updateCart() {
    if (cart.length > 0) {
        document.querySelector('.cartsection').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
        document.querySelector('.cartBtn').style.display = 'block';
        document.querySelector('.cartBtnMobile span').innerHTML = cart.length;
        document.querySelector('.cartBtn span').innerHTML = cart.length;
        let total = 0;
        let totalItem = 0;
        for (let i in cart) {
            let subwayItem = subwayJson.find( (item) => item.id == cart[i].id );
            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);
            total += subwayItem.price[cart[i].size] * cart[i].qtCart;
            totalItem += cart[i].price * cart[i].qtCart;
            cartItem.querySelector('img').src = subwayItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = subwayItem.name;
            cartItem.querySelector('.cart--item-price').innerHTML = `${subwayItem.price[cart[i].size].toLocaleString('pt-br',{ style:'currency', currency: 'BRL' })}`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtCart;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qtCart > 1) {
                    cart[i].qtCart -= 1;
                } else {
                    cart.splice(i, 1);
                }                
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qtCart++;
                updateCart();
            });
            document.querySelector('.cart').append( cartItem );
        }
        document.querySelector('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br',{ style:'currency', currency: 'BRL' })}`;
        document.querySelector('.clearCart p').addEventListener('click', () => {
            cart = [];
            updateCart();
        });
    } else {
        document.querySelector('.cartsection').classList.remove('show');
        document.querySelector('.cartBtnMobile span').innerHTML = cart.length;
        document.querySelector('.cartBtn span').innerHTML = cart.length;
    }
}