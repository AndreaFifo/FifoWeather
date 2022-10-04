//Key of openweather API
const apiKey = 'ff24c4014e5de01237371f8e9f162185';
const ipGeocalizationKey = '77aa98107a2640f6bfc5e467f59fef9c';

/* Setting theme and language during page loading */
window.addEventListener('load', () => {
    setTheme(getCookie('theme'));
    if(getCookie('theme') == 'dark')
        changeBtnTheme(document.querySelector('#lgt-theme-icon').parentElement, selectedDivTheme, themeBtns, window.location.pathname == '/FifoWeather/landing-page.html' ? appBtnImgs : null);
    else
        changeBtnTheme(document.querySelector('#drk-theme-icon').parentElement, selectedDivTheme, themeBtns, window.location.pathname == '/FifoWeather/landing-page.html' ? appBtnImgs : null);

    lang = getCookie('lang');
    document.querySelectorAll('.lang ul li').forEach(e => {
        if(e.getAttribute('value') == getCookie('lang')){
            removeSelection(document.querySelectorAll('.lang ul li'));
            e.classList.add('selected');
        }
    })

    if(window.location.pathname == '/FifoWeather/' || window.location.pathname == '/FifoWeather/index.html'){
        changeChartTheme(getTheme());
        changeLangApp(lang);
    }

    if(window.location.pathname == '/FifoWeather/landing-page.html'){
        changeDeviceImg(true);
        changeLangLand(lang);
    }
})

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
const themeBtns = document.querySelectorAll('.right .btn-slider .btn');
const selectedDivTheme = document.querySelector('.right .btn-slider .selected-btn');
    
themeBtns.forEach(e => {
    e.addEventListener('click', () => {
        if(!e.classList.contains('selected')){
            setTheme(getTheme() == 'dark' ? 'light' : 'dark');
        
            changeBtnTheme(e, selectedDivTheme, themeBtns, window.location.pathname == '/FifoWeather/landing-page.html' ? appBtnImgs : null)
            if(window.location.pathname == '/FifoWeather/landing-page.html')
                changeDeviceImg()

            if(window.location.pathname == '/FifoWeather/' || window.location.pathname == '/FifoWeather/index.html'){
                changeChartTheme(getTheme());
            }
            
            setCookie('theme', getTheme(), 30);
        }
    });
})

function changeBtnTheme(e, selDiv = selectedDivTheme, arr = themeBtns, deviceBtns = null){
    arr.forEach(e => {
        e.classList.remove('dark', 'light');
    })

    if(deviceBtns != null){
        deviceBtns.forEach(e => {
            e.classList.remove('dark', 'light');
        })
        
        for (let i = 0; i < deviceBtns.length; i++) {
            if(deviceBtns[i].classList.contains('selected')){
                deviceBtns[i].classList.add(getTheme());
            }
        }
    }

    e.classList.add(getTheme())

    if(selDiv === selectedDivTheme){
        selDiv.style.left = getTheme() == 'light' ? '0' : '50%';
    }
    else{
        selDiv.style.left == '0px' ? selDiv.style.left = '50%' : selDiv.style.left = '0';
        changeDeviceImg();
    }

    removeSelection(arr);
    e.classList.add('selected');
}

/* Function that change the current language when it is clicked and call the changeLang function */
const languages = document.querySelectorAll('.lang ul li');
languages.forEach(e => {
    e.addEventListener('click', () => {
        if(!e.classList.contains('selected')){
            lang = e.getAttribute('value');
            if(window.location.pathname == '/FifoWeather/' || window.location.pathname == '/FifoWeather/index.html'){
                changeLangApp(lang);
            }
            else{
                changeLangLand(lang);
            }

            removeSelection(document.querySelectorAll('.lang ul li'));
            e.classList.add('selected');

            setCookie('lang', lang, 30);

            if(window.location.pathname == '/FifoWeather/' || window.location.pathname == '/FifoWeather/index.html'){
                if((searchBar.value.trim() != "" && searchBar.value.trim() != null) || (lat != 0 && long != 0))
                    initializationPage()
            }
        }
    })
})

function removeSelection(el){
    el.forEach(e => {
        for (let i = 0; i < 3; i++) {
            e.classList.remove('selected');
        }
    });
}


//Function that, depending on the weather(in particular on the icon and description), set the source for the images to display the correct weather icon
function setImage(element, weather, icon, description){
    if(weather.toLowerCase() == 'clear' || weather.toLowerCase() == 'sereno' || weather.toLowerCase() == 'claro'){
        if(icon == '01d')
            element.setAttribute('src', './assets/img/weather/clear-sun.png');
        else
            element.setAttribute('src', './assets/img/weather/moon.png');
    }
    else if(weather.toLowerCase() == 'clouds' || weather.toLowerCase() == 'nuvoloso' || weather.toLowerCase() == 'nubes'){
        if(description == 'few clouds'){
            if(icon == '02d')
                element.setAttribute('src', './assets/img/weather/sun-lil-cloudy.png');
            else
                element.setAttribute('src', './assets/img/weather/night-lil-cloudy.png');
        }
        else if(description == 'scattered clouds'){
            if(icon == '03d')
                element.setAttribute('src', './assets/img/weather/sun-mid-cloudy.png');
            else
                element.setAttribute('src', './assets/img/weather/night-mid-cloudy.png');
        } 
        else
            element.setAttribute('src', './assets/img/weather/broken-cloudy.png');    
    }
    else if((weather.toLowerCase() == 'rain' || weather.toLowerCase() == 'pioggia' || weather.toLowerCase() == 'lluvia') || (weather.toLowerCase() == 'drizzle' || weather.toLowerCase() == 'pioggerella' || weather.toLowerCase() == 'llovizna')){
        if(description == 'shower rain' || description.includes('drizzle'))
            element.setAttribute('src', './assets/img/weather/rain.png');
        else{
            if(icon == '10d')
                element.setAttribute('src', './assets/img/weather/sun-rain.png');
            else
                element.setAttribute('src', './assets/img/weather/night-rain.png');
        }
    }
    else if((weather.toLowerCase() == 'thunderstorm' || weather.toLowerCase() == 'temporale' || weather.toLowerCase() == 'tormenta') && (description.includes('rain') || description.includes('drizzle'))){
        element.setAttribute('src', './assets/img/weather/heavyrain-storm.png');
    }
    else if((weather.toLowerCase() == 'thunderstorm' || weather.toLowerCase() == 'temporale' || weather.toLowerCase() == 'tormenta') && (!description.includes('rain') && !description.includes('drizzle'))){
        element.setAttribute('src', './assets/img/weather/thunder.png');
    }
}


//Function that changes the timezone of the date
function changeTimeZone(date, timezone){
    return new Date(
        new Date(date).toLocaleString('en-US', { timeZone: timezone})
    );
}


//Object that contain weather condition(Rain, Clear ecc.) in the other languages
const weatherTranslate = {
    en: {
        Rain: 'Rain',
        Thunderstorm: 'Thunderstorm',
        Drizzle: 'Drizzle',
        Snow: 'Snow',
        Clear: 'Clear',
        Clouds: 'Clouds'
    },
    it: {
        Rain: 'Pioggia',
        Thunderstorm: 'Temporale',
        Drizzle: 'Pioggerella',
        Snow: 'Neve',
        Clear: 'Sereno',
        Clouds: 'Nuvoloso'
    },
    es: {
        Rain: 'Lluvia',
        Thunderstorm: 'Tormenta',
        Drizzle: 'Llovizna',
        Snow: 'Nieve',
        Clear: 'Claro',
        Clouds: 'Nubes'
    }
}

function removeLoadingAnimation(first = false){
    setTimeout(function(){
        document.querySelector('.loading').classList.add('animate__animated', 'animate__fadeOut', 'animate__faster');
        document.querySelector('.loading').addEventListener('animationend', () => {
            document.querySelector('.loading').classList.remove('animate__animated', 'animate__fadeIn', 'animate__faster');
            document.querySelector('.loading').remove();
            document.body.classList.remove('no-overflow');

            if(!first)
                AOS.refresh();
        });

        if(window.location.pathname == '/FifoWeather/' || window.location.pathname == '/FifoWeather/index.html')
            launchApi(first);
        else
            landApi();
    }, 2500);
}

function getTheme(){
    const theme = document.documentElement.classList.value;
    
    if(theme == 'light-theme')
        return 'light';
    else if(theme == 'dark-theme')
        return 'dark';
}

function setTheme(newTheme){
    const oldTheme = document.documentElement.classList.value;
    document.documentElement.classList.toggle(oldTheme);

    if(window.location.pathname == '/FifoWeather/landing-page.html')
        changeDeviceImg();

    if(newTheme == 'light')
        document.documentElement.classList.toggle('light-theme');
    else if(newTheme == 'dark')
        document.documentElement.classList.toggle('dark-theme');
}
