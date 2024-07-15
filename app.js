document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "e4227b7bbdM1P5ZZ2M4fSEAuIMCMWkZX"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function getWeatherIcon(weatherText) {
        const weatherIcons = {
           "Cloudy": "./assets/cloudy.gif",
            "Partly cloudy": "./assets/cloudy.gif",
            "Sunny": "./assets/sun.gif",
            "Rain": "./assets/rain.gif",
            "Showers": "./assets/rain.gif",
            "Thunderstorms": "./assets/rain.gif"
            // Add more mappings as needed
        };
        return weatherIcons[weatherText] || null;
    }

    function displayHourlyForecast(data) {
        let forecastContent = "<h2>Hourly Forecast</h2><div class='hourly-forecast'>";
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temperature = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);
            forecastContent += `
                <div class='forecast-item'>
                    <p>${time}</p>
                    ${weatherIcon ? `<img src='${weatherIcon}' alt='${weather}' class='weather-icon' />` : ''}
                    <p>${temperature}°C</p>
                    <p>${weather}</p>
                </div>
            `;
        });
        forecastContent += "</div>";
        weatherDiv.innerHTML += forecastContent;
    }

    function displayDailyForecast(dailyForecasts) {
        let dailyForecastContent = "<h2>Daily Forecast</h2><div class='daily-forecast'>";
        dailyForecasts.forEach(day => {
            const date = new Date(day.Date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = day.Temperature.Minimum.Value;
            const temperatureMax = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            const weatherIcon = getWeatherIcon(weather);
            dailyForecastContent += `
                <div class='forecast-item-row'>
                    <div class='forecast-item'>
                        <p>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div class='forecast-item'>
                        <p>${dayOfWeek}</p>
                    </div>
                    <div class='forecast-item'>
                        ${weatherIcon ? `<img src='${weatherIcon}' alt='${weather}' class='weather-icon' />` : ''}
                    </div>
                    <div class='forecast-item'>
                        <p>${temperatureMin}°C - ${temperatureMax}°C</p>
                    </div>
                </div>
            `;
        });
        dailyForecastContent += "</div>";
        weatherDiv.innerHTML += dailyForecastContent;
    }
    
});
