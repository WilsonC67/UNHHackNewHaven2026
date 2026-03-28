
function extractWeatherSummaries(weatherJson: Weather.WeatherData): Weather.DayWeatherSummary[] {
  return weatherJson.DailyForecasts.map((forecast) => ({
    date: forecast.Date.split("T")[0],
    tempHigh: forecast.Temperature.Maximum.Value,
    iconPhrase: forecast.Day.IconPhrase,
  }));
}

export async function searchLocation(city: string) {
    let req = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search/?q=${city}&apikey=${process.env.WeatherAPIKey}`)

    if (!req.ok) {
        let info = <{
            code: number,
            message: string
        }> await req.json()
        console.error(info.message)
        return;
    }

    let data = <Weather.WeatherLocation[]> await req.json()

    return data;
}

export async function getWeather(key: string){
    let req = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.WeatherAPIKey}`
            }
            }
        );

    let data = <Weather.WeatherData> await req.json();
    return extractWeatherSummaries(data);
}

export default {
    getWeather,
    searchLocation
}

