const config = require('config');
const axios = require('axios');

const getGeoLocation = ( address ) => {
    const options = {
        params: {
            address: address,
            key: config.gmaps.auth.key
        }
    };

    return axios.get(config.gmaps.calls.geoLocation.url, options);
};

module.exports = {
    getGeoLocation: getGeoLocation
};
