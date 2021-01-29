'user strict';
const error = require("./error");
const utils = require("./utils");
const osm = require("./openstreetmap");
const ow = require("./openweather");
const no = require("./nominatism");

exports.getbyfilter = async function(req) {

    let criterion_not_met = [];

    // Create filtres from req
    let filtres = utils.filtres(req)

    //if there has been an error
    if (!filtres.ok) {
        return filtres;
    } else {
        filtres = filtres.data;
    }

    // Create the url to fetch with criterias
    const url = osm.api_url(filtres);

    // Fetching
    const res = await osm.api_fetch(url);
    
    if (!res.ok) {
        return error.e(res.status, `An error has occured when fetching on the openstreetmap api.`);
    }

    const data_map = await res.json();

    // Sort the node
    let [beaches, harbors, lighthouses, car_parks] = osm.sort_node(data_map.elements);

    if (beaches.length == 0) {
        criterion_not_met.push("planning");

        const url2 = osm.api_url({
            longitude: filtres.longitude,
            latitude: filtres.latitude,
            radius: filtres.radius
        });

        const res2 = await osm.api_fetch(url2);
    
        if (!res2.ok) {
            return error.e(res.status, `An error has occured when fetching on the openstreetmap api.`);
        }
    
        const data_map2 = await res2.json();

        [beaches, harbors, lighthouses, car_parks] = osm.sort_node(data_map2.elements);

        if (beaches.length == 0) {
            return  error.e204(`Criterias: location`);
        }
    }

    // Filter the beaches with the type of the surface of it
    if (filtres.hasOwnProperty("type")) {
        beaches_t = osm.filter_type(beaches, filtres);
        if (beaches_t.length == 0) {
            criterion_not_met.push("type");
            beaches_t = Array.from(beaches);
        }
    } else {
        beaches_t = Array.from(beaches);
    }

    // format the beaches information into plages
    let plages = osm.format(beaches_t);

    // add more information about plannings if needed
    if (harbors.length !== 0) {
        plages = osm.addlighthouses(plages, harbors);
    }
    if (lighthouses.length !== 0) {
        plages = osm.addlighthouses(plages, lighthouses);
    }
    if (car_parks.length !== 0) {
        plages = osm.addcar_parks(plages, car_parks);
    }

    // filter 30 plages (limitation by openweathermap for 1 minute (/2 if we want 2 request by minute))
    plages = utils.filter(plages, filtres, 30);

    // fetching the weather for each beach
    let data_weather = await ow.api_fetch(plages);

    //if there has been an error
    if (!data_weather.ok) {
        return data_weather
    }

    // Format data of the weather
    let weather = ow.format(data_weather.data)

    // Filter weather with time
    if (filtres.hasOwnProperty("time")) {
        weather = ow.filter_time(weather, filtres)
    } else {
        weather = ow.format_time(weather)
    }

    // Filter weather with type of weather
    if (filtres.hasOwnProperty("weather")) {
        let filter_w = ow.filter_weather(plages, weather, filtres)
        var plages_w = filter_w[0];
        var weather_w = filter_w[1];
        if (plages_w.length == 0) {
            criterion_not_met.push("weather");
            plages_w = Array.from(plages);
            weather_w = Array.from(weather);
        }
    } else {
        var plages_w  = Array.from(plages)
        var weather_w = Array.from(weather)
    }

    // Filter weather with type of sea
    if (filtres.hasOwnProperty("sea")) {
        let filter_s = ow.filter_sea(plages_w, weather_w, filtres)
        var plages_s = filter_s[0];
        var weather_s = filter_s[1];
        if (plages_s.length == 0) {
            criterion_not_met.push("sea");
            plages_s = Array.from(plages_w);
            weather_s = Array.from(weather_w);
        }
    } else {
        var plages_s  = Array.from(plages_w)
        var weather_s = Array.from(weather_w)
    }

    // Take the 3 nodes nearest of the initial location=
    const filter_f = utils.filter2(plages_s, weather_s, filtres, 3)
    const plages_f = filter_f[0];
    const weather_f = filter_f[1];

    // Choose a good time to go
    const plages_c = ow.choose(plages_f, weather_f)

    // fecth adress from lat & lon
    const adress = await no.api_fetch(plages_c);

    // add to plages
    const plages_a = no.format(plages_c, adress.data);

    return {
        ok: true,
        status: 200,
        descritption: (criterion_not_met.length?`All things done`:`All things done succesfully`),
        criterion_not_met: criterion_not_met,
        output: plages_a
    };
};
