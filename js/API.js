const geolocatationKey = '5595c5460b52963202d8e3e03f6291da';
const weatherKey = 'ff24c4014e5de01237371f8e9f162185';

let unit = 'metric';
let unitLetter = '°C';
let unitMesure = 'km/h';
let city = '';

function launchApi(){
    fetch(`http://api.positionstack.com/v1/forward?access_key=${geolocatationKey}&query=${city}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.data[0].latitude}&lon=${data.data[0].longitude}&units=${unit}&appid=${weatherKey}`);
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            let generalData = {
                city: city.charAt(0).toUpperCase() + city.slice(1),
                temp: Math.round((data.daily[0].temp.max + data.daily[0].temp.min) / 2),
                weather: data.daily[0].weather[0].main,
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

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');

    const degree = document.createElement('h2');
    degree.innerText = Math.round(forecast.temp) + unitLetter;

    const weather = document.createElement('p');
    weather.innerText = forecast.weather[0].main;

    textDiv.appendChild(degree);
    textDiv.appendChild(weather);
    carouselCell.appendChild(hourP);
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