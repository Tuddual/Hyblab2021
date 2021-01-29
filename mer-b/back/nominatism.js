'user strict';
const fetch = require('node-fetch');
const convert = require("xml-js");
const cst = require("./constants.json");

exports.api_fetch = async (plages) => {

    let data = [];

    for (const node of plages) {

        try {
            var res = await fetch(cst.nominatim.api_url + `lat=${node.latitude}&lon=${node.longitude}`);
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

    for (let i =0; i<3; i++) {

        plages[i].adresse = {
            rue: adress[i].reversegeocode.addressparts.road._text,
            code_postale: adress[i].reversegeocode.addressparts.postcode._text,
            commune: adress[i].reversegeocode.addressparts.village._text
        };
    }

    return plages
}
