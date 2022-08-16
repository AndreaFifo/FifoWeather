const apiKey = 'ff24c4014e5de01237371f8e9f162185';

let unit = 'metric';
let unitLetter = '°C';
let unitMesure = 'km/h';
let city = '';

function launchApi(){
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data[0].lat}&lon=${data[0].lon}&units=${unit}&appid=${apiKey}`);
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const date = new Date();
            document.getElementById('date').innerText = 'Today, ' + date.getDate() + ' ' + date.toLocaleString('en-us', { month: 'short' });

            let generalData = {
                city: city.charAt(0).toUpperCase() + city.slice(1),
                temp: Math.round((data.daily[0].temp.max + data.daily[0].temp.min) / 2),
                weather: data.daily[0].weather[0].main,
                descr: data.daily[0].weather[0].description,
                icon: data.daily[0].weather[0].icon,
                wind: data.daily[0].wind_speed,
                humidity: data.daily[0].humidity,
                pressure: data.daily[0].pressure
            };
            setGeneralData(generalData);

            let graphData = [
                Math.round(data.daily[0].temp.night),
                Math.round(data.daily[0].temp.morn),
                Math.round(data.daily[0].temp.day),
                Math.round(data.daily[0].temp.eve)
            ];
            drawChart(graphData);

            setHourlyData(data.hourly);

            document.querySelector('.weather').classList.remove('hidden');
        })
        .catch((err) => {
            console.log(err);
        });
}

function setGeneralData(data){
    document.getElementById('city').innerText = data.city;
    document.getElementById('temperature').innerText = data.temp + unitLetter;
    document.getElementById('weather-description').innerText = data.weather;
    document.getElementById('wind').innerText = data.wind + ' ' + unitMesure;
    document.getElementById('humidity').innerText = data.humidity + '%';
    document.getElementById('pressure').innerText = data.pressure + ' Pa';

    setImage(document.getElementById('general-weather-img'), data.weather, data.icon, data.descr);
}

function setHourlyData(data){
    let date = new Date();
    let currentHour = date.getHours();
    let hoursLeftMidNight = 23 - currentHour;

    removeForecast();

    for(let i = 0; i <= hoursLeftMidNight; i++, currentHour++){
        addForecast(data[i], currentHour);
    }

    swiper.select(0, false, true);
}

function addForecast(forecast, hour){
    const carouselCell = document.createElement('div');
    carouselCell.classList.add('carousel-cell');

    const hourP = document.createElement('p');
    hourP.innerText = hour  + ':00';

    const img = document.createElement('img');
    img.setAttribute('alt', 'weather icon');
    setImage(img, forecast.weather[0].main, forecast.weather[0].icon, forecast.weather[0].description);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const degree = document.createElement('h2');
    degree.innerText = Math.round(forecast.temp) + unitLetter;

    const weather = document.createElement('p');
    weather.innerText = forecast.weather[0].main;

    textDiv.appendChild(degree);
    textDiv.appendChild(weather);
    carouselCell.appendChild(hourP);
    carouselCell.appendChild(img);
    carouselCell.appendChild(textDiv);

    swiper.insert(carouselCell);
}

function removeForecast(){
    const forecastes = document.querySelectorAll('.carousel-cell');

    if(forecastes){
        for (let i = 0; i < forecastes.length; i++) {
            swiper.remove(forecastes[i]);
        }
    }
}

function setImage(element, weather, icon, description){
    if(weather.toLowerCase() == 'clear'){
        element.setAttribute('src', './assets/img/weather/sun.png');
    }
    else if(weather.toLowerCase() == 'clouds' && (icon == '02d' || icon == '02n' || icon == '03d' || icon == '03n')){
        element.setAttribute('src', './assets/img/weather/sun-cloud.png');
    }
    else if(weather.toLowerCase() == 'clouds' && (icon != '02d' && icon != '02n')){
        element.setAttribute('src', './assets/img/weather/cloudy.png');
    }
    else if(weather.toLowerCase() == 'rain' && (icon == '09d' || icon == '09n')){
        element.setAttribute('src', './assets/img/weather/rain.png');
    }
    else if(weather.toLowerCase() == 'rain' && (icon != '09d' && icon != '09n')){
        element.setAttribute('src', './assets/img/weather/sun-rain.png');
    }
    else if(weather.toLowerCase() == 'drizzle'){
        element.setAttribute('src', './assets/img/weather/drizzle.png');
    }
    else if(weather.toLowerCase() == 'snow'){
        element.setAttribute('src', './assets/img/weather/snow.png');
    }
    else if(weather.toLowerCase() == 'snow'){
        element.setAttribute('src', './assets/img/weather/snow.png');
    }
    else if(weather.toLowerCase() == 'thunderstorm' && (description.includes('rain') || description.includes('drizzle'))){
        element.setAttribute('src', './assets/img/weather/thunderstorm-rain.png');
    }
    else if(weather.toLowerCase() == 'thunderstorm' && (!description.includes('rain') && !description.includes('drizzle'))){
        element.setAttribute('src', './assets/img/weather/thunderstorm.png');
    }
    else if(weather.toLowerCase() == 'snow'){
        element.setAttribute('src', './assets/img/weather/snow.png');
    }
}