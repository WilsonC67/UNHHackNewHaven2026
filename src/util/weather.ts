const apiKey = process.env.WeatherAPIKey;

function getWeather(city: string){
    fetch(`https:dataservice.accuweather.com/locations/v1/cities/search/?q=${city}&apikey=${apiKey}`)
    .then(response => response.json())
    .then(cityjson => {
        const locationKey = response[0].ParentCity.Key;
        return fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/30day/${locationKey}?apiKey=${apiKey}`);
    })
    .then(response => response.json())
    .then(weatherjson => {
        //need to parse the weather
    })
    .catch(error => console.error("Error:", error))



}
