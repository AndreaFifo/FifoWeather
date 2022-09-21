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

        initializationPage()
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

        initializationPage()
    }
});

//Function that removes the displayed error
function removeError(){
    if(document.querySelector('.error'))
        document.querySelector('.error').remove()
}


function initializationPage(){
    removeError();
    launchApi();
    resetSettingsTime();
}
/* Selecting forecast visualization when user click on 'Hourly' or 'Daily' */
const settingsTime = document.querySelectorAll('.time p');
settingsTime.forEach((e, i) => {
    e.addEventListener('click', () => {
        settingsTime[0].classList.remove('selected');
        settingsTime[1].classList.remove('selected');

        document.querySelector('.time .selected-btn').style.left = i == 0 ? '0' : '50%';
        setSwiperData(i == 0 ? hourlyData : dailyData, i == 0 ? 'h' : 'd');
        updateChartData(i == 0 ? hourlyData : dailyData, i == 0 ? 'h' : 'd', i == 0 ? dailyData[0] : '');

        /* 
            Equivalent
                |
                |
                | 
                V
        
        */

        /*if(i == 0){
            document.querySelector('.selected-div').style.left = '0';
            setSwiperData(hourlyData, 'h');
            updateChartData(hourlyData, 'h', dailyData[0]);
        }
        else{
            document.querySelector('.selected-div').style.left = '50%';
            setSwiperData(dailyData, 'd');
            updateChartData(dailyData, 'd')
        }*/

        animateCarousel();
        e.classList.add('selected');
    })
})

function resetSettingsTime(){
    if(settingsTime[0].classList.contains('selected'))
        return;
    
    settingsTime[1].classList.remove('selected');
    settingsTime[0].classList.add('selected');
    document.querySelector('.other-informations .time .selected-btn').style.left = '0';
    updateChartData(hourlyData, 'h', dailyData[0]);
}

/* Declaration of swiper element */
const swiper = new Flickity('.carousel', {
    prevNextButtons: false,
    cellAlign: 'left',
    contain: true,
    resize: true,
    pageDots: false,
    freeScroll: true,
    draggable: '>1',
})

/* Adding animation on carousel when it switches between the hourly one and the daily one */
function animateCarousel(){
    const carousel = document.querySelector('.carousel');
    carousel.classList.add('animate__animated', 'animate__fadeIn', 'animate__fast');
    carousel.addEventListener('animationend', () => {
        carousel.classList.remove('animate__animated', 'animate__fadeIn', 'animate__fast');
    })
}

function animateEverything(){
    const generalInfo = document.querySelector('.general-info');
    const time = document.querySelector('.time');
    const forecast = document.querySelector('.forecast');
    const graph = document.querySelector('.graph');

    generalInfo.classList.add('animate__animated', 'animate__fadeInLeft');
    generalInfo.addEventListener('animationend', () => {
        generalInfo.classList.remove('animate__animated', 'animate__fadeInLeft');
    })

    forecast.classList.add('animate__animated', 'animate__fadeInDown');
    forecast.addEventListener('animationend', () => {
        forecast.classList.remove('animate__animated', 'animate__fadeInDown');
    })

    time.classList.add('animate__animated', 'animate__fadeIn', 'animate__delay-1s');
    time.addEventListener('animationend', () => {
        time.classList.remove('animate__animated', 'animate__fadeIn', 'animate__delay-1s');
    })

    graph.classList.add('animate__animated', 'animate__fadeInUp');
    graph.addEventListener('animationend', () => {
        graph.classList.remove('animate__animated', 'animate__fadeInUp');
    })
}

/* Defining several language to allow user change language */
const language = {
    en: {
        lang_: [
            'English',
            'Italian',
            'Spanish',
        ],
        placeholder: "Search a city's weather...",
        search: 'Search',
        generalData: {
            day: 'Today, ',
            otherInfo: {
                header: 'Other information',
                details: {
                    wind: 'Wind',
                    humidity: 'Humidity',
                    pressure: 'Pressure'
                }
            }
        },
        forecast: {
            hourly: 'Hourly',
            daily: 'Daily'
        },
        chart: {
            day: 'Day temperature',
            week: 'Week temperature'
        }
    },

    it: {
        lang_: [
            'Inglese',
            'Italiano',
            'Spagnolo',
        ],
        placeholder: "Cerca il meteo di una città...",
        search: 'Cerca',
        generalData: {
            day: 'Oggi, ',
            otherInfo: {
                header: 'Altre informazioni',
                details: {
                    wind: 'Vento',
                    humidity: 'Umidità',
                    pressure: 'Pressione'
                }
            }
        },
        forecast: {
            hourly: 'Ogni ora',
            daily: 'Giornaliero'
        },
        chart: {
            day: 'Temperatura giorn.',
            week: 'Temperatura sett.'
        }
    },

    es: {
        lang_: [
            'Inglés',
            'Italiano',
            'Español',
        ],
        placeholder: "Buscar el clima de una ciudad...",
        search: 'Búsqueda',
        generalData: {
            day: 'Este dia, ',
            otherInfo: {
                header: 'Otra información',
                details: {
                    wind: 'Viento',
                    humidity: 'Humedad',
                    pressure: 'Presión'
                },
            }
        },
        forecast: {
            hourly: 'Cada hora',
            daily: 'Diariamente'
        },
        chart: {
            day: 'Temperatura diurna',
            week: 'Temperatura de la semana'
        }
    }
}

/* Function that changes language of all the element on the page */
function changeLangApp(lang){
    //Header
    document.querySelectorAll('.lang ul li p').forEach((e, i) => {
        e.innerText = language[lang].lang_[i];
    })

    //Search bar
    document.getElementById('search').setAttribute('placeholder', language[lang].placeholder);
    document.querySelector('.search-bar p').innerText = language[lang].search;

    //General data section
    document.querySelector('.details > p').innerText = language[lang].generalData.otherInfo.header;
    
    let details = Object.values(language[lang].generalData.otherInfo.details)
    document.querySelectorAll('.details-list small').forEach((e, i) => {
        e.innerText = details[i];
    })

    //Forecast
    let times = Object.values(language[lang].forecast)
    document.querySelectorAll('.other-informations .time p').forEach((e, i) => {
        e.innerText = times[i];
    })

    //Graph
    document.querySelector('.graph p').innerText = language[lang].chart.day;
    data.labels = labels[lang];
}