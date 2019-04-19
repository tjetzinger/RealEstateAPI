const config = require('config');
const axios = require('axios');
const { logAxiosResponse, logAxiosError } = require('../middleware');

const getGeoLocation = ( address, reqId ) => {
    const options = {
        params: {
            address: address,
            key: config.gmaps.auth.key
        }
    };

    return axios.get(config.gmaps.calls.geoLocation.url, options)
    .then(function(response) {
        logAxiosResponse(reqId, response);
        return response;
    })
    .catch(function (error) {
        logAxiosError(reqId, error);
    });
};

module.exports = {
    getGeoLocation: getGeoLocation
};
