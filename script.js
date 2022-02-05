AOS.init();

// Carousel
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

pizzaJson.map( (item, index) => {
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} (${item.sizes[0]})`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    document.querySelector('.pizza-area').append( pizzaItem );
});