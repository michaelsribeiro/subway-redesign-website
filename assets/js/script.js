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

subwayJson.map( (item, index) => {
    const subwayItem = document.querySelector('.models .pizza-item').cloneNode(true);
    subwayItem.setAttribute('data-key', index);
    subwayItem.querySelector('.pizza-item--img img').src = item.img;
    subwayItem.querySelector('.pizza-item--price').innerHTML = `${item.price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} (${item.sizes[0]})`;
    subwayItem.querySelector('.pizza-item--name').innerHTML = item.name;
    subwayItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('body').style.overflow = 'hidden';
        let key = event.target.closest('.pizza-item').getAttribute('data-key');
        quant = 1;
        pizzaKey = key;        $('input[type=checkbox]').prop('checked',false);
        document.querySelector('.pizzaBig img').src = subwayJson[key].img;
        document.querySelector('.pizzaInfo h1').innerHTML = subwayJson[key].name;
        document.querySelector('.pizzaInfo--desc').innerHTML = subwayJson[key].description;
        document.querySelector('.pizzaInfo--actualPrice').innerHTML = `${subwayJson[key].price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 0) size.classList.add('selected');
        });
        document.querySelector('.pizzaInfo--qt').innerHTML = quant;
        document.querySelector('.pizzaWindowArea').style.opacity = 0;
        document.querySelector('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {            
            document.querySelector('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    document.querySelector('.pizza-area').append( subwayItem );
});

function closeModal() {
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 200);
    document.querySelector('body').style.overflow = 'visible';
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

document.querySelectorAll('.pizzaInfo--size').forEach( (size, sizeIndex) => {
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');        
        if (sizeIndex === 0){
            console.log(sizeIndex);
            document.querySelector('.pizzaInfo--actualPrice').innerHTML = `${subwayJson[pizzaKey].price[0].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        } else {            
            console.log(sizeIndex);            
            document.querySelector('.pizzaInfo--actualPrice').innerHTML = `${subwayJson[pizzaKey].price[1].toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        }
    });
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
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

function updateCart() {
    if (cart.length > 0) {
        document.querySelector('.cartsection').classList.add('show');
        document.querySelector('.cart').innerHTML = '';
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
    }
}