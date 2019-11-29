const moment = require('moment');

// Replace the subscriptionKey string value with your valid subscription key in .env.
const azure_maps_key = process.env.AZURE_MAPS_KEY;
const open_weather_key = process.env.OPEN_WEATHER_KEY;


moment.locale('pl');
var myDate = moment().format('LL');
console.log(myDate)

var azure_maps_typeahead = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: 'https://atlas.microsoft.com/search/address/json?subscription-key=' + azure_maps_key + '&language=pl-PL' + '&api-version=1.0&query=%QUERY',
        wildcard: '%QUERY',
        filter: function (response) {
            var locations = [];
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
    }
);

const unit = 'metric'; // for Celsius


const searchWeather = async searchCity =>
        await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appId=${open_weather_key}&units=${unit}`)
            .then(result => result.json())
            .then(result => init(result))
            .catch(err => {
                    document.getElementById('description-additional').innerText='Nie znaleziono takiego miasta';
                    document.getElementById('description-additional').style.display='block';
                    document.querySelector('.weather-description').style.visibility = 'hidden';
                    console.log(err);
        })

document.getElementById('search-submit').addEventListener('click', () => {
    let searchCity = document.getElementById('search-input').value;
    if(searchCity){
            document.getElementById('city-name').innerHTML = searchCity.split(",")[0];
            searchWeather(searchCity);
        }
    })

const init = resultFromOpenWeatherMap => {
    switch(resultFromOpenWeatherMap.weather[0].main) {
        case 'Clear':
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            break;
        case 'Clouds':
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            break;
        case 'Rain':
        case 'Drizzle':
            document.body.style.backgroundImage = 'url("./static/photo/rain.jpg")';
            break;
        case 'Thunderstorm':
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            break;                      
        case 'Snow':
            document.body.style.backgroundImage = 'url("./static/photo/snow.jpg")';
            break;
        case 'Mist':
            document.body.style.backgroundImage = 'url("./static/photo/cloud.jpg")';
            break;
        default:
            document.body.style.backgroundImage = 'url("./static/photo/default.jpg")';
            break;
    }
    document.getElementById('description-additional').style.display = 'none';
    document.querySelector('.weather-description').style.visibility = 'visible';
    console.log(resultFromOpenWeatherMap)
    let weatherProperty =  resultFromOpenWeatherMap.weather[0];
    let weather = resultFromOpenWeatherMap.main;
    let temp = document.getElementById('temp');
    let tempMin = document.getElementById('temp-min');
    let tempMax = document.getElementById('temp-max');
    let description = document.getElementById('description');
    let windSpeed = document.getElementById('wind-speed');
    let humidity = document.getElementById('humidity');
    let weatherIcon = document.getElementById('weather-icon');

    
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + weatherProperty.icon + '.png';
    temp.innerHTML = Math.floor(weather.temp) + '&#176';
    tempMin.innerHTML = Math.floor(weather.temp_min) + '&#176';
    tempMax.innerHTML = Math.floor(weather.temp_max) + '&#176';
    description.innerText = weatherProperty.description.charAt(0).toUpperCase() + weatherProperty.description.slice(1);
    windSpeed.innerHTML = 'Wiatr: ' + Math.floor(resultFromOpenWeatherMap.wind.speed) + 'm/s';
    humidity.innerHTML = 'Wilgotność: ' + Math.floor(weather.humidity) + "%";

}
