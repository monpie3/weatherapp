# WeatherApp

WeatherApp was developed as part of the CodersCamp course in the academic year 2019/2020.

It is a simple weather application that allows users to check the current weather forecast for different locations.


## Deployment
The application was originally deployed on heroku, but since it was no longer free, I moved it to render.

PREVIEW: 🔗 [jaknadworze.onrender.com](https://jaknadworze.onrender.com)

The website is in Polish.

## What I learned?
- Using environment variables.
- Webpack to optimize the project structure and enhance performance.
- Collect current weather and forecast data from [OpenWeatherMap](https://openweathermap.org/).
- [Skycons](https://darkskyapp.github.io/skycons/) library for animated weather glyphs.
- Displaying a different thermometer based on the temperature in a given location.
- Location suggestions using Azure Maps and [Typehead](https://twitter.github.io/typeahead.js/examples/) (it stopped working due to an outdated Azure key; a similar feature is described here -> [medium](https://medium.com/@jibinpb/location-autocomplete-using-azure-maps-typeahead-js-b72172cb1d55))


The tech stack includes HTML & CSS, JavaScript, Node.js, Webpack.


## Getting Started

Follow these steps to set up and run the app on your local machine:

### Prerequisites
Make sure you have the following installed on your machine:

[Node.js](https://nodejs.org/en)

### Installation

To get started with this project, simply download the code and run:
* `npm i` to install all the dependencies for the project
* and `npm start` to start the app on your localhost (default http://localhost:8080/).
