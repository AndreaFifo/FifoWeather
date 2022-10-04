window.addEventListener('load', () => {
    AOS.init({
        duration: 1000,
        once: true
    });
})

let lat = .0;
let long = .0;

let lang = getCookie('lang') != (undefined || null) ? getCookie('lang') : 'en';

let city = '';

const landLanguages = {
    en: {
        main: {
            h1: 'Rapid and accurate <br> forecastest weather',
            h3: 'Find out world wide weather forecast',
            a: 'Try it now for free'
        },
        services: {
            h2: 'What we offer',
            servicesList: {
                service1: {
                    h3: 'World wide',
                    p: 'Search the weather of every place in the world'
                },
                service2: {
                    h3: 'Efficiency',
                    p: 'We offer the best and fastest experience possible'
                },
                service3: {
                    h3: 'Hourly & Daily',
                    p: 'With these forecastes you can be informed in the best way'
                }
            }
        },
        about: {
            app: {
                h1: 'All the information that <span>you need to know.</span>',
                h3: 'Thanks to our application, you can see all the weather information of the city where you live and your favorite cities. In particular, you can have access to all the hourly forecastes of the day and of the week.'
            },
            api: {
                h1: 'All the data came from <span>Open Weather’s API.</span>',
                h3: 'They are providing highly recognisable weather products that make working with the weather data a way easier. They work with millions of developers, up to the complex enterprise systems.'
            }
        },
        end: {
            h1: 'Try FifoWeather now!'
        }
    },
    it: {
        main: {
            h1: 'Rapide e veloci <br> previsioni meteo',
            h3: 'Scopri le previsioni del tempo in tutto il mondo',
            a: 'Prova ora gratis'
        },
        services: {
            h2: 'Cosa offriamo',
            servicesList: {
                service1: {
                    h3: 'Copertura mondiale',
                    p: 'Cerca il meteo di ogni luogo del mondo'
                },
                service2: {
                    h3: 'Efficienza',
                    p: 'Offriamo la migliore e veloce esperienza possibile'
                },
                service3: {
                    h3: 'Orarie e giornaliere',
                    p: 'Informati al meglio con queste tipologie di previsioni'
                }
            }
        },
        about: {
            app: {
                h1: 'Tutte le informazioni <span>che devi sapere.</span>',
                h3: 'Grazie alla nostra applicazione, puoi vedere tutte le informazioni metereologiche della città dove vivi e delle tue città preferite. In particolare, puoi avere accesso alle previsione meteo orarie e giornaliere della settimana.'
            },
            api: {
                h1: 'I dati provengono <span>dalla API di OpenWeather</span>',
                h3: 'Loro forniscono prodotti altamente riconoscibili che semplificano notevolmente il lavoro con i dati meteorologici. Lavorano con milioni di sviluppatori, fino ai complessi sistemi aziendali.'
            }
        },
        end: {
            h1: 'Prova FifoWeather ora!'
        }
    },
    es: {
        main: {
            h1: 'Rápido y preciso <br> pronóstico del tiempo',
            h3: 'Descubra el pronóstico del tiempo en todo el mundo',
            a: 'Pruébalo gratis'
        },
        services: {
            h2: 'Lo que ofrecemos',
            servicesList: {
                service1: {
                    h3: 'En todo el mundo',
                    p: 'Busca el clima de todos los lugares del mundo'
                },
                service2: {
                    h3: 'Eficiencia',
                    p: 'Ofrecemos la mejor y más rápida experiencia posible.'
                },
                service3: {
                    h3: 'Por hora y diario',
                    p: 'Con estas previsiones podrás estar informado de la mejor manera'
                }
            }
        },
        about: {
            app: {
                h1: 'Toda la información que <span>necesitas saber.</span>',
                h3: 'Gracias a nuestra aplicación, podrás ver toda la información meteorológica de la ciudad donde vives y de tus ciudades favoritas. En particular, puedes tener acceso a todas las previsiones horarias del día y de la semana.'
            },
            api: {
                h1: 'Todos los datos provienen de <span>API de Open Weather.</span>',
                h3: 'Están proporcionando productos meteorológicos altamente reconocibles que facilitan el trabajo con los datos meteorológicos. Trabajan con millones de desarrolladores, hasta los complejos sistemas empresariales.'
            }
        },
        end: {
            h1: '¡Prueba FifoWeather ahora!'
        }
    }
}

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

            console.log()

            setImage(
                document.getElementById('weather-img'), 
                data.daily[0].weather[0].main, 
                data.daily[0].weather[0].icon, 
                data.daily[0].weather[0].description.charAt(0).toUpperCase() + data.daily[0].weather[0].description.slice(1)
            );

            document.querySelector('.temp').innerText = Math.round((data.daily[0].temp.max + data.daily[0].temp.min) / 2) + '°';
            document.querySelector('.weather').innerText = weatherTranslate[lang][data.daily[0].weather[0].main];
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

    let device = img.getAttribute('alt');

    if(changeTheme == false){
        device = img.getAttribute('alt') == 'phone' ? 'pc' : 'phone';
        img.setAttribute('alt', device);
        animateAppDevice();
    }

    img.setAttribute(
        'src',
        './assets/img/landing-page/' + getTheme() + '-' + device + '.png'
    );
}

function animateAppDevice(){
    const img = document.getElementById('app');

    img.classList.add('animate__animated', 'animate__fadeInRight', 'animate__fast');

    img.addEventListener('animationend', () => {
        img.classList.remove('animate__animated', 'animate__fadeInRight', 'animate__fast');
    })
}

function changeLangLand(lang){
    document.querySelector('main h1').innerHTML = landLanguages[lang]['main']['h1'];
    document.querySelector('main h3').innerText = landLanguages[lang]['main']['h3'];
    document.querySelector('main h2').innerText = landLanguages[lang]['main']['a'];



    document.querySelector('.services h2').innerText = landLanguages[lang]['services']['h2'];
    document.querySelector('.services .service:nth-child(1) h3').innerText = landLanguages[lang]['services']['servicesList']['service1']['h3'];
    document.querySelector('.services .service:nth-child(1) p').innerText = landLanguages[lang]['services']['servicesList']['service1']['p'];

    document.querySelector('.services .service:nth-child(2) h3').innerText = landLanguages[lang]['services']['servicesList']['service2']['h3'];
    document.querySelector('.services .service:nth-child(2) p').innerText = landLanguages[lang]['services']['servicesList']['service2']['p'];

    document.querySelector('.services .service:nth-child(3) h3').innerText = landLanguages[lang]['services']['servicesList']['service3']['h3'];
    document.querySelector('.services .service:nth-child(3) p').innerText = landLanguages[lang]['services']['servicesList']['service3']['p'];


    
    document.querySelector('.about .app h1').innerHTML = landLanguages[lang]['about']['app']['h1'];
    document.querySelector('.about .app h3').innerHTML = landLanguages[lang]['about']['app']['h3'];

    document.querySelector('.about .api h1').innerHTML = landLanguages[lang]['about']['api']['h1'];
    document.querySelector('.about .api h3').innerHTML = landLanguages[lang]['about']['api']['h3'];


    document.querySelector('.end h1').innerHTML = landLanguages[lang]['end']['h1'];
}