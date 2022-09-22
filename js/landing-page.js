window.addEventListener('load', () => {
    AOS.init({
        duration: 1000
    });
})

let lat = .0;
let long = .0;

let lang = getCookie('lang') != (undefined || null) ? getCookie('lang') : 'en';

let city = '';

function landApi(){ 
    fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ipGeocalizationKey}`, {cache: 'no-cache'})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            city = data.city;
            lat = data.latitude;
            long = data.longitude;

            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&lang=${lang}&appid=${apiKey}`, {cache: 'no-cache'});
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            date = changeTimeZone(new Date(), data.timezone);
        
            document.querySelector('.info p').innerText = date.getDate() + ' ' + date.toLocaleString(lang, { month: 'short' });
            document.querySelector('.info .city').innerText = city;

            setImage(
                document.getElementById('weather-img'), 
                data.daily[0].weather[0].main, 
                data.daily[0].weather[0].icon, 
                data.daily[0].weather[0].description.charAt(0).toUpperCase() + data.daily[0].weather[0].description.slice(1)
            );

            document.querySelector('.temp').innerText = Math.round((data.daily[0].temp.max + data.daily[0].temp.min) / 2) + '°';
            document.querySelector('.weather').innerText = data.daily[0].weather[0].main;
        })
}

const appBtnImgs = document.querySelectorAll('.app-images .btn-slider .btn');
const selectedAppBtn = document.querySelector('.app-images .btn-slider .selected-btn');

appBtnImgs.forEach(e => {
    e.addEventListener('click', () => {
        if(!e.classList.contains('selected')){
            changeBtnTheme(e, selectedAppBtn, appBtnImgs);
        }
    })
})

function changeDeviceImg(changeTheme = false){
    const img = document.querySelector('#app')

    let themeStr = theme.getAttribute('href') === './css/theme/light.css' ? 'light' : 'dark';
    let device = img.getAttribute('alt');

    if(changeTheme == false){
        device = img.getAttribute('alt') == 'phone' ? 'pc' : 'phone';
        img.setAttribute('alt', device);
        animateAppDevice(device);
    }

    img.setAttribute(
        'src',
        './assets/img/landing-page/' + themeStr + '-' + device + '.png'
    );
}

function animateAppDevice(device){
    const img = document.getElementById('app');
    const p = document.querySelector('.about .app-images p')

    if(device == 'phone')
        img.classList.add('animate__animated', 'animate__fadeInLeft', 'animate__fast');
    else{
        img.classList.add('animate__animated', 'animate__fadeInRight', 'animate__fast');
        p.classList.add('animate__animated', 'animate__fadeInRight');
    }

    img.addEventListener('animationend', () => {
        img.classList.remove('animate__animated', 'animate__fadeInLeft', 'animate__fadeInRight', 'animate__fast');
        p.classList.remove('animate__animated', 'animate__fadeInLeft', 'animate__fadeInRight');
    })
}
