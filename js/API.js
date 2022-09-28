//Declaring variables that will be used in API request
let unit = 'metric';
let unitLetter = '°C';
let unitMesure = 'km/h';
let city = '';
let lang = '';

let lat = .0;
let long = .0;

//Declaring date to calculate forecastes and other things related to time
let date;

let dailyData = {};
let hourlyData = {};

let graphData = [];

//Function that start the API request, it will fetch all the data and will call other functions to display/calculate other information
function launchApi(first = false){
    //Geolocalization API
    let promise;
    if(first)
        promise = fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${ipGeocalizationKey}`, {cache: 'no-cache'});
    else
        promise = fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`, {cache: 'no-cache'})

    promise
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(data.length == 0){
                error();
                throw 'City not found!';
            }

            //Weather API
            if(first){
                city = data.city;
                lat = data.latitude;
                long = data.longitude;
            }
            else{
                lat = data[0].lat;
                long = data[0].lon;
            }
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=${unit}&lang=${lang}&appid=${apiKey}`, {cache: 'no-cache'});
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            animateEverything();
            
            //Initialize date based on timezone of the city requested
            date = changeTimeZone(new Date(), data.timezone);
        
            document.getElementById('date').innerText = language[lang].generalData.day + date.getDate() + ' ' + date.toLocaleString(lang, { month: 'short' });

            //Creating object to make easier the selection of data on function.
            let generalData = {
                city: city.charAt(0).toUpperCase() + city.slice(1),
                temp: Math.round((data.daily[0].temp.max + data.daily[0].temp.min) / 2),
                weather: data.daily[0].weather[0].main,
                descr: data.daily[0].weather[0].description.charAt(0).toUpperCase() + data.daily[0].weather[0].description.slice(1),
                icon: data.daily[0].weather[0].icon,
                wind: data.daily[0].wind_speed,
                humidity: data.daily[0].humidity,
                pressure: data.daily[0].pressure
            };
            setGeneralData(generalData);

            graphData = [
                Math.round(data.daily[0].temp.night),
                Math.round(data.daily[0].temp.morn),
                Math.round(data.daily[0].temp.day),
                Math.round(data.daily[0].temp.eve)
            ];
            drawChart(graphData);

            hourlyData = data.hourly;
            dailyData = data.daily;
            setSwiperData(hourlyData, 'h');

            document.querySelector('.weather').classList.remove('hidden');
            //When the container is hidden and the class 'hidden' is removed, idk why, but the carousel doesn't display at all.
            //So thanks to this interval, the carousel will be resized after 1 millisecond when the class is removed.
            setInterval(() => {
                swiper.resize();
            }, 1);
        })
        .catch((err) => {
            console.log(err);
        });
}

//Function that display all the information of the current day on the left container(Desktop view) or first container(Mobile view)
function setGeneralData(data){
    document.getElementById('city').innerText = data.city;
    document.getElementById('temperature').innerText = data.temp + unitLetter;
    document.getElementById('general-weather').innerText = weatherTranslate[lang][data.weather];
    document.getElementById('general-description').innerText = data.descr;
    document.getElementById('wind').innerText = data.wind + ' ' + unitMesure;
    document.getElementById('humidity').innerText = data.humidity + '%';
    document.getElementById('pressure').innerText = data.pressure + ' Pa';

    setImage(document.getElementById('general-weather-img'), data.weather, data.icon, data.descr);
}

//Function that calculate the hours left to 23 or days of the week and create forecast containers
function setSwiperData(data, type){
    removeForecast();

    if(type == 'h'){
        let hour = date.getHours();
        let hoursLeftMidNight = 23 - hour;

        for(let i = 0; i <= hoursLeftMidNight; i++, hour++){
            addForecast(data[i], hour, 'h');
        }
    }
    else if(type == 'd'){
        let dailyForecastDate = new Date();
        for(let i = 1; i < 7; i++){
            dailyForecastDate.setDate(dailyForecastDate.getDate() + 1);
            addForecast(data[i], dailyForecastDate.getDate() + ' ' + dailyForecastDate.toLocaleString(lang, { weekday: 'short' }), 'd');
        }
    }

    swiper.select(0, false, true);
}

//Function that create forecastes and add them into the carousel
function addForecast(forecast, info, type){
    const carouselCell = document.createElement('div');
    carouselCell.classList.add('carousel-cell');

    const information = document.createElement('p');

    const img = document.createElement('img');
    img.setAttribute('alt', 'weather icon');
    setImage(img, weatherTranslate[lang][forecast.weather[0].main], forecast.weather[0].icon, forecast.weather[0].description);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const degree = document.createElement('h2');

    const weather = document.createElement('p');
    weather.innerText = weatherTranslate[lang][forecast.weather[0].main];

    if(type == 'h'){
        information.innerText = info  + ':00';
        degree.innerText = Math.round(forecast.temp) + unitLetter;
    }
    else if(type == 'd'){
        information.innerText = info;
        degree.innerText = Math.round((forecast.temp.max + forecast.temp.min) / 2) + unitLetter;
    }

    textDiv.appendChild(degree);
    textDiv.appendChild(weather);
    carouselCell.appendChild(information);
    carouselCell.appendChild(img);
    carouselCell.appendChild(textDiv);
    swiper.insert(carouselCell);
}

//Function that remove the actual forecastes displayed if you've already done a research
function removeForecast(){
    const forecastes = document.querySelectorAll('.carousel-cell');

    if(forecastes){
        for (let i = 0; i < forecastes.length; i++) {
            swiper.remove(forecastes[i]);
        }
    }
}



//Function that modify chart data based on the time setting selected
function updateChartData(data, type, hDataDaily = {}){
    const graphP = document.querySelector('.graph p');
    
    let temps = [];
    let days = [];
    

    if(type == 'd'){
        let date = new Date();
        for (let i = 1; i < data.length; i++) {
            date.setDate(date.getDate() + 1);
     
             temps[i - 1] = Math.round((data[i].temp.max + data[i].temp.min) / 2);
             days[i - 1] = date.toLocaleString(lang, { weekday: window.innerWidth <= 350 ? 'narrow' : 'short' });
        }
        
        drawChart(temps, 'd', days);
        graphP.innerText = language[lang].chart.week;
    }
    else if(type == 'h'){
        temps = [
            Math.round(hDataDaily.temp.night),
            Math.round(hDataDaily.temp.morn),
            Math.round(hDataDaily.temp.day),
            Math.round(hDataDaily.temp.eve)
        ];
    
        drawChart(temps);
        graphP.innerText = language[lang].chart.day;
    }
}

//Function that creates and displays an error container
function error(){
    document.querySelector('.weather').classList.add('hidden');

    const div = document.createElement('div');
    div.classList.add('error');

    const errorMessage = document.createElement('p');
    errorMessage.innerText = "We're sorry about that, but the city searched by you hasn't been found.";

    div.appendChild(errorMessage);
    div.classList.add('animate__animated', 'animate__fadeInDown', 'animate__fast');
    document.querySelector('main').appendChild(div);
}