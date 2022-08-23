/* Using of hamburger icon */
const menuBtn = document.querySelector(".hamburger");
const rightPart = document.querySelector("header .right");
let open = false;

menuBtn.addEventListener("click", () => {
    if(!open){
        menuBtn.classList.add("open");
        rightPart.classList.add("show-right");
        open = true;
    } else{
        menuBtn.classList.remove("open");
        rightPart.classList.remove("show-right");
        open = false;
    }
});



/* Changing theme of the page */
const themeBtn = document.querySelector('.theme');
const theme = document.getElementById('theme');
    
themeBtn.addEventListener('click', () => {
    theme.setAttribute('href', theme.getAttribute('href') === './css/theme/light.css' ? './css/theme/dark.css' : './css/theme/light.css');
    
    themeBtn.innerHTML = theme.getAttribute('href') === './css/theme/light.css' ? 'Dark <img src="./assets/img/icons/moon-theme.svg" alt="dark theme">' : 'Light <img src="./assets/img/icons/sun.svg" alt="light theme">';
    
});



/* Choosing unit of data */
const units = [document.getElementById('celcius'), document.getElementById('fahrenheit')];
units.forEach((e, i) => {
    e.addEventListener('click', () => {
        if(i == 0){
            document.getElementById('fahrenheit').classList.add('not-selected');
            unit = 'metric';
            unitLetter = '°C';
            unitMesure = 'km/h';
        } else {
            document.getElementById('celcius').classList.add('not-selected');
            unit = 'imperial';
            unitLetter = '°F';
            unitMesure = 'mph';
        }
        
        e.classList.remove('not-selected');
    })
});



/* Resetting search bar on click */
const searchBar = document.getElementById('search');
const resetBtn = document.getElementById('reset');
searchBar.addEventListener('keyup', () => {
    if(searchBar.value == "")
        resetBtn.style.display = 'none';
    else
        resetBtn.style.display = 'block';
})

resetBtn.addEventListener('click', () => {
    searchBar.value = "";
    resetBtn.style.display = 'none';
})



/* Checking city and launching API when search button is clicked */
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    if(searchBar.value.trim() != "" && searchBar.value.trim() != null){
        city = searchBar.value.trim();
        launchApi();
    }
});



/* Selecting forecast visualization when user click on 'Hourly' or 'Daily' */
const settingsTime = document.querySelectorAll('.time p');
settingsTime.forEach((e, i) => {
    e.addEventListener('click', () => {
        settingsTime[0].classList.remove('selected');
        settingsTime[1].classList.remove('selected');

        if(i == 0){
            document.querySelector('.selected-div').style.left = '0';
            setSwiperData(hourlyData, 'h');
        }
        else{
            document.querySelector('.selected-div').style.left = '50%';
            setSwiperData(dailyData, 'd');
        }

        animateCarousel();
        e.classList.add('selected');
    })
})



/* Declaration of swiper element */
const swiper = new Flickity('.carousel', {
    prevNextButtons: false,
    cellAlign: 'left',
    contain: true,
    resize: true,
    pageDots: false,
    freeScroll: true,
    draggable: '>1',
    groupCells: false,
})

function animateCarousel(){
    const carousel = document.querySelector('.carousel');
    carousel.classList.add('animate__animated', 'animate__fadeIn', 'animate__faster');
    carousel.addEventListener('animationend', () => {
        carousel.classList.remove('animate__animated', 'animate__fadeIn', 'animate__faster');
    })
}



