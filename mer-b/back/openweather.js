'user strict';
const fetch = require('node-fetch');
const cst = require("./constants.json");
const error = require("./error");
const HttpProxyAgent = require('http-proxy-agent');

exports.api_fetch = async (plages) => {

    let options = {
        agent: new HttpProxyAgent('http://cache.ha.univ-nantes.fr:3128'),
    };

    let data = [];

    for (const node of plages) {

        try {
            var res = await fetch(cst.openweather.api_url + `lat=${node.latitude}&lon=${node.longitude}&appid=${cst.openweather.key}`, options);
        } catch (e) {
            res = {ok:false, status:e.code, msg:e.message}
        }
    
        if (!res.ok) {

            if (res.status == 401) {
                return error.e(res.status, `Error: You need to input an an API key in the file: mer-b/back/constants.json`);
            } else {
                return error.e(res.status, (res.msg || `An error has occured when fetching on the openweathermap api.`));
            }
        }

        const data_node = await res.json();
        data.push(data_node)
    }
    return {ok:true, data:data}
}

exports.format = (data) => {

    weather = [];

    for (const data_plage of data) {

        let prediction = [[], []];
        
        const data_hourly = data_plage.hourly;
        const data_daily = data_plage.daily;

        for (const p of data_hourly) {

            let i = data_daily.findIndex(elem => p.dt < elem.dt)

            prediction[0].push({
                time: p.dt,
                temperature: p.temp,
                feels_like: p.feels_like,
                weather: p.weather[0].main,
                wind: p.wind_speed,
                sunrise: data_daily[i].sunrise,
                sunset: data_daily[i].sunset
            });
        }

        for (let i = 2; i<data_daily.length; i++) {
            prediction[1].push({
                time: data_daily[i].dt,
                temperature: data_daily[i].temp,
                feels_like: data_daily[i].feels_like,
                weather: data_daily[i].weather[0].main,
                wind: data_daily[i].wind_speed,
                sunrise: data_daily[i].sunrise,
                sunset: data_daily[i].sunset
            });
        }

        weather.push(prediction);
    }

    return weather;
}

exports.filter_time = (weather, filtres) => {

    let new_weather = [];
    
    for (let i=0; i<weather.length; i++) {
        let new_weather_plage = [];
        for (let j = 0; j<weather[i][0].length; j++) {
            let weather_time = weather[i][0][j];
            const dawn = filtres.time === "dawn"  && weather_time.time > weather_time.sunrise - 3600 - 5400 && weather_time.time < weather_time.sunrise - 3600 + 5400;
            const day = filtres.time  === "day"   && weather_time.time > weather_time.sunrise - 3600 + 5400 && weather_time.time < weather_time.sunset  - 3600 - 5400;
            const dusk = filtres.time === "dusk"  && weather_time.time > weather_time.sunset  - 3600 - 5400 && weather_time.time < weather_time.sunset  - 3600 + 5400;
            const night = filtres.time === "night" && weather_time.time > weather_time.sunset  - 3600 + 5400 && weather_time.time < weather_time.sunrise - 3600 - 5400;
            if (dawn || day || dusk || night) {
                    new_weather_plage.push(weather_time);
            }
        }
        for (let j = 0; j<weather[i][1].length; j++) {
            let weather_time = weather[i][1][j];
            let time = (filtres.time == "dawn" ? "morn" : filtres.time == "day" ? "day" : filtres.time == "dusk" ? "eve" : "night");
            weather_time.temperature = weather_time.temperature[time];
            weather_time.feels_like = weather_time.feels_like[time];
            new_weather_plage.push(weather_time);
        }

        new_weather.push(new_weather_plage);
    }

    return new_weather
}

exports.format_time = (weather) => {

    let new_weather = [];

    for (let i=0; i<weather.length; i++) {
        let new_weather_plage = [];
        for (let j = 0; j<weather[i][0].length; j++) {
            new_weather_plage.push(weather[i][0][j]);
        }
        for (let j = 0; j<weather[i][1].length; j++) {
            let weather_time = weather[i][1][j];
            weather_time.temperature = weather_time.temperature["day"];
            weather_time.feels_like  = weather_time.feels_like["day"];
            new_weather_plage.push(weather_time);
        }

        new_weather.push(new_weather_plage);
    }

    return new_weather
}

exports.filter_weather = (plages, weather, filtres) => {

    for (let i = 0; i < weather.length; i++) {
        if (filtres.weather === "stormy") {
            weather[i] = weather[i].filter(item => ["Thunderstorm", "Ash", "Squall", "Tornado", "Sand"].includes(item.weather))
        } else if (filtres.weather === "clear") {
            weather[i] = weather[i].filter(item => ["Clear"].includes(item.weather))
        } else if (filtres.weather === "bad") {
            weather[i] = weather[i].filter(item => ["Rain", "Drizzle", "Fog",  "Smoke", "Snow", "Dust"].includes(item.weather))
        } else if (filtres.weather === "cloudy") {
            weather[i] = weather[i].filter(item => ["Haze", "Mist", "Clouds"].includes(item.weather))
        }

        if (!weather[i].length) {
            weather.splice(i, 1);
            plages.splice(i, 1);
        }
    }

    return [plages, weather]
}

exports.filter_sea = (plages, weather, filtres) => {

    const threshold = 5.14444; // 10 Knots in m/s

    for (let i = 0; i < weather.length; i++) {
        if (filtres.weather === "hectic") {
            weather[i] = weather[i].filter(item => item.wind > threshold);
        } else if (filtres.weather === "calm") {
            weather[i] = weather[i].filter(item => item.wind < threshold);
        }

        if (!weather[i].length) {
            weather.splice(i, 1);
            plages.splice(i, 1);
        }
    }

    return [plages, weather]
}

exports.choose = (plages, weather) => {

    for (let i = 0; i < plages.length; i++) {
        const weather_plage = weather[i].reduce((a,b)=>a.temperature>b.temperature?a:b)
        plages[i].time = new Date(weather_plage.time * 1000);
        plages[i].weather= {
            temperature: (weather_plage.temperature-273.15).toFixed(2),
            feels_like: (weather_plage.feels_like-273.15).toFixed(2),
            sunrise: new Date(weather_plage.sunrise * 1000),
            sunset: new Date(weather_plage.sunset * 1000)
        }
    }

    return plages
}
