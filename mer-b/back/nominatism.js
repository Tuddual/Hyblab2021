'user strict';
const fetch = require('node-fetch');
const convert = require("xml-js");
const cst = require("./constants.json");
const HttpsProxyAgent = require('https-proxy-agent');

exports.api_fetch = async (plages) => {
    
    let options = {
        agent: new HttpsProxyAgent('http://cache.ha.univ-nantes.fr:3128'),
    };

    let data = [];

    for (const node of plages) {

        try {
            var res = await fetch(cst.nominatim.api_url + `lat=${node.latitude}&lon=${node.longitude}`, options);
        } catch (e) {
            res = {
                ok: false,
                status: e.code,
                msg: e.message
            }
        }

        if (!res.ok) {
            return error.e(res.status, (res.msg || `An error has occured when fetching on the nominatim api.`));
        }

        const xml = await res.text();
        data.push(convert.xml2js(xml, {compact: true, spaces: 4}));
    }
    return {
        ok: true,
        data: data
    }
}

exports.format = (plages, adress) => {

    for (let i =0; i<plages.length; i++) {

        plages[i].adresse = {
            rue: (adress[i].reversegeocode.addressparts.hasOwnProperty("road")? adress[i].reversegeocode.addressparts.road._text : ""),
            code_postale: (adress[i].reversegeocode.addressparts.hasOwnProperty("postcode")? adress[i].reversegeocode.addressparts.postcode._text : ""),
            commune: (adress[i].reversegeocode.addressparts.hasOwnProperty("city")? adress[i].reversegeocode.addressparts.city._text : adress[i].reversegeocode.addressparts.hasOwnProperty("town")? adress[i].reversegeocode.addressparts.town._text : adress[i].reversegeocode.addressparts.hasOwnProperty("village")? adress[i].reversegeocode.addressparts.village._text : "")
        };
    }

    return plages
}
