'user strict';
const utils = require("./utils");
const fetch = require('node-fetch');
const cst = require("./constants.json");
const HttpsProxyAgent = require( 'https-proxy-agent' );

exports.api_url = (filtres) => {

    // angle representing 50 km on the earth's surface
    // d = 2 * pi * r * a / 360, so a is equal to :
    const arc = 360 * filtres.radius/(2 * 6371 * Math.PI);

    const prefix = `?data=[out:json]`; // [out:json]
    const bbox = `[bbox:${filtres.latitude - arc},${filtres.longitude - arc},${filtres.latitude + arc},${filtres.longitude + arc}];`; // [bbox:_,_,_,_];
    const france = `area[name="France"];`; // area["name"="France"];
    
    const pre_ask = `node`; // node
    const with_nothing = `(area)`; // (area)
    const ask = `["natural"="beach"]->.beaches;`; // ["natural"="beach"]->.beaches;

    const prefix_output = `++(.beaches`; // (.beaches
    const sufix_output = `;);`; // ;);

    const sufix = `out;&target=compact`; // out;

    if (!filtres.hasOwnProperty("planning")) {
        return  prefix + bbox + france + pre_ask + with_nothing + ask + prefix_output + sufix_output + sufix;
    } else {
        const harbor = filtres.planning.includes("harbor");
        const lighthouse = filtres.planning.includes("lighthouse");
        const car = filtres.planning.includes("car_park");
    
        const ask_lighthouse = `(node["man_made"="lighthouse"](area);node["man_made"="beacon"](area);)->.lighthouse;`; // (node["man_made"="lighthouse"](area);node["man_made"="beacon"](area);)->.lighthouse;
        const ask_harbor = `node(area)["harbour"="yes"]["seamark:type"="harbour"]->.harbor;`; // node["harbour"="yes"]["seamark:type"="harbour"](area)->.harbor;
        const ask_car = `node(area)["amenity"="parking"]->.parking;`; // node["amenity"="parking"](area)->.carpark;
        
        const with_lighthouse = `(around.lighthouse:${(lighthouse?filtres.dist_lighthouse:"0")})`; // (around.lighthouse:10000)
        const with_harbor = `(around.harbor:${(harbor?filtres.dist_harbor:"0")})`; // (around.harbor:10000)
        const with_car = `(around.carpark:${(car?filtres.dist_car:"0")})`; // (around.car:10000)

        const separator_output = `;+`; // ;

        return prefix + bbox + france + (harbor ? ask_harbor : ``) + (lighthouse ? ask_lighthouse : ``) + (car ? ask_car : ``) + pre_ask + (harbor ? with_harbor : ``) + (lighthouse ? with_lighthouse : ``) + (car ? with_car : ``) + ask + prefix_output + (harbor ? separator_output + `.harbor` : ``) + (lighthouse ? separator_output + `.lighthouse` : ``) + (car ? separator_output + `.parking` : ``) + sufix_output + sufix;
    }
}

exports.api_fetch = async (url) => {

    let options = {
        agent: new HttpsProxyAgent('http://cache.ha.univ-nantes.fr:3128'),
    };

    let i = 1;
    let response = await fetch(cst.openstreetmap.api_url1 + url, options);

    while (!response.ok && i < 4) {
        i++;
        response = await fetch(cst.openstreetmap[`api_url${i}`] + url, options);
    }

    return response;
}

exports.sort_node = (data) => {

    let beaches = [];
    let harbors = [];
    let lighthouses = [];
    let car_parks = [];

    // Sort the node
    for (const node of data) {
        if (node.tags.hasOwnProperty("natural") && node.tags.natural == "beach") {
            beaches.push(node)
        } else if (node.tags.hasOwnProperty("harbour") && node.tags.harbour == "yes") {
            harbors.push(node)
        } else if (node.tags.hasOwnProperty("amenity") && node.tags.amenity == "parking") {
            car_parks.push(node)
        } else if (node.tags.hasOwnProperty("man_made") && (node.tags.man_made == "lighthouse" || node.tags.man_made == "beacon")) {
            lighthouses.push(node)
        }
    }

    return [beaches, harbors, lighthouses, car_parks]
}

exports.filter_type = (beaches, filtres) => {
    
    beaches = beaches.filter(node => !node.tags.hasOwnProperty("surface"))
    if (filtres.type = "sand") {
        beaches = beaches.filter(node => ["sand", "sable", "sable_et_gallet", "dirt/sand"].includes(node.tags.surface))
    } else if (filtres.type = "pebble") {
        beaches = beaches.filter(node => ["pebblestone", "sable_et_gallet", "shingle", "shingles", "dirt/sand"].includes(node.tags.surface))
    } else if (filtres.type = "rocks") {
        beaches = beaches.filter(node => ["gravel", "asphalt", "fine_gravel", "stone"].includes(node.tags.surface))
    }
    
    return beaches
}

exports.format = (beaches) => {

    let plages = [];

    for (const node of beaches) {
        plages.push({
            latitude: node.lat,
            longitude: node.lon,
            nom: (node.tags.hasOwnProperty("name") ? node.tags.name : null),
            type: (node.tags.hasOwnProperty("surface") ? node.tags.surface : null)
        });
    }

    return plages
}

exports.addharbors = (plages, harbors) => {

    for (const node of plages) {
        const harbor = utils.nearest(node, harbors);
        node.port = {
            latitude: harbor.lat,
            longitude: harbor.lon,
            name: (harbor.tags.hasOwnProperty("name") ? harbor.tags.name : null),
        }
    }
    return plages;
}

exports.addlighthouses = (plages, lighthouses) => {
    for (const node of plages) {
        const lighthouse = utils.nearest(node, lighthouses);
        node.phare = {
            latitude: lighthouse.lat,
            longitude: lighthouse.lon,
            name: (lighthouse.tags.hasOwnProperty("name") ? lighthouse.tags.name : null),
        }
    }
    return plages;
}

exports.addcar_parks = (plages, car_parks) => {

    for (const node of plages) {
        const car_park = utils.nearest(node, car_parks);
        node.parking = {
            latitude: car_park.lat,
            longitude: car_park.lon,
            name: (car_park.tags.hasOwnProperty("name") ? car_park.tags.name : null),
        }
    }
    return plages;
}
