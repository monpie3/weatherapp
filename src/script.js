const moment = require('moment');
require('dotenv').config;

// Replace the subscriptionKey string value with your valid subscription key in .env. or herokuapp
const azure_maps_key = process.env.AZURE_MAPS_KEY;
const open_weather_key = process.env.OPEN_WEATHER_KEY;

moment.locale('pl');
var myDate = moment().format('LL');
document.getElementById('time').innerHTML='<strong>'+myDate+'</strong>';
document.querySelector('.weather-description').style.visibility = 'hidden';

var azure_maps_typeahead = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://atlas.microsoft.com/search/address/json?subscription-key=' + azure_maps_key + '&language=pl-PL' + '&api-version=1.0&query=%QUERY',
        wildcard: '%QUERY',
        filter: function (response) {
            var locations = [];
            //console.log(locations);
            $(response.results).each(function (index) {
                if (!!$(this)[0].address.municipality){
                    locations.push({
                        display: [$(this)[0].address.municipality, $(this)[0].address.countrySubdivision, $(this)[0].address.country].join(", "),
                        city: $(this)[0].address.municipality,
                        country: $(this)[0].address.country,
                    });
                }
            });
            
            return locations;//response.countries;
        }
    }
});


$('#remote .typeahead').typeahead(
    {
        highlight: true,
    },
    {
        name: 'azure-maps-typeahead',
        display: 'display',
        source: azure_maps_typeahead
    }) // Number 13 is the "Enter" key on the keyboard
    .on('keyup', this, function (event) {
        if (event.keyCode == 13) document.getElementById("search-submit").click()
    });


const units = 'metric';
const searchWeather = cityName =>
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appId=${open_weather_key}&units=${units}&lang=pl`)
        .then(result => result.json())
        .then(result => init(result))
        .catch(err => {
            document.getElementById('description-additional').innerHTML='<img class="unknow" src="./static/photo/unknown.png"> <p>Nie znaleziono takiego miasta</p>';
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            document.getElementById('description-additional').style.display='block';
            document.querySelector('.weather-description').style.visibility = 'hidden';
            console.log(err);
})

document.getElementById('search-submit').addEventListener('click', () => {
    let searchCity = document.getElementById('search-input').value;
    if(searchCity) {
        let cityName = searchCity.split(",")[0];
        let countryCode = searchCity.split(",")[1];
        let country = searchCity.split(",")[2];
        let toSearch = '';
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        if(country) {
            toSearch = [cityName, countryCode].join(", ");
            country= country.charAt(0).toUpperCase() + country.slice(1);
            document.getElementById('city-name').innerHTML =  `${cityName}, ${country}`; 
        }
        else {
            toSearch = cityName;
            document.getElementById('city-name').innerHTML = cityName; 
        }         
        searchWeather(toSearch);
    }
})

const setIcons = (icon, iconID) => {
    const skycons = new Skycons({color: '#f2f2f2'});
    const currentIcon = icon.toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}

const init = resultFromOpenWeatherMap => {
    document.querySelector('.page-content').style.display = 'block';
    switch(resultFromOpenWeatherMap.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("./static/photo/clear.jpg")';
            break;
        case 'Clouds':
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            break;
        case 'Rain':
        case 'Drizzle':
            document.body.style.backgroundImage = 'url("./static/photo/rain.jpg")';
            break;
        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("./static/photo/thunder.jpg")';
            break;                      
        case 'Snow':
            document.body.style.backgroundImage = 'url("./static/photo/snow.jpg")';
            break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Sand':
        case 'Ash':
        case 'Squall':
        case 'Tornado':
        case 'Fog':
            document.body.style.backgroundImage = 'url("./static/photo/mist.png")';
            break;
        default:
            document.body.style.backgroundImage = 'url("./static/photo/default.jpg")';
            break;
    }
    document.getElementById('description-additional').style.display = 'none';
    document.querySelector('.weather-description').style.visibility = 'visible';
    //console.log(resultFromOpenWeatherMap)
    let weatherProperty = resultFromOpenWeatherMap.weather[0];
    let weather = resultFromOpenWeatherMap.main;
    let temp = document.getElementById('temp');
    let tempMin = document.getElementById('temp-min');
    let tempMax = document.getElementById('temp-max');
    let description = document.getElementById('description');
    let windSpeed = document.getElementById('wind-speed');
    let humidity = document.getElementById('humidity');
    let weatherIcon = document.getElementById('weather-icon');
    let iconTemp = document.getElementById('icon-temp');

    setIcons(weatherProperty.main, weatherIcon); 
    if (weatherProperty.main.toUpperCase()=="HAZE") {
        setIcons("FOG", weatherIcon); //to agree with skycons
    }

    temp.innerHTML = Math.floor(weather.temp) + '&#176C';
    tempMin.innerHTML = 'temp. min: ' + Math.floor(weather.temp_min) + '&#176C';
    tempMax.innerHTML = 'temp. max: ' + Math.floor(weather.temp_max) + '&#176C';
    description.innerText = weatherProperty.description.charAt(0).toUpperCase() + weatherProperty.description.slice(1) + '.';
    windSpeed.innerHTML = 'Wiatr: ' + Math.floor(resultFromOpenWeatherMap.wind.speed) + ' m/s';
    humidity.innerHTML = 'Wilgotność: ' + Math.floor(weather.humidity) + " %";
    if (weather.temp > 30) {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-full fa-5x" aria-hidden="true"></i>';
    } else if (weather.temp > 20) {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-three-quarters fa-5x" aria-hidden="true"></i>';
    } else if (weather.temp > 10) {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-half fa-5x" aria-hidden="true"></i>';
    } else if (weather.temp >= 0) {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-quarter fa-5x" aria-hidden="true"></i>';
    } else if (weather.temp < 0) {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-empty fa-5x" aria-hidden="true"></i>';
    } else {
        iconTemp.innerHTML = '<i class="fa fa-thermometer-half fa-5x" aria-hidden="true"></i>';
    }  
}
