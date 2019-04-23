const { NotFoundError } = require('rest-api-errors');
const config = require('config');
const axios = require('axios');
const OAuth   = require('oauth-1.0a');
const crypto  = require('crypto');
const _ = require('lodash');
const { logAxiosResponse, logAxiosError } = require('../middleware');

const oauth = OAuth({
    consumer: config.im24.oauth.consumer,
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

const getValuationBasic = ( property, reqId ) => {
    const valuationBasicCall = config.im24.calls.valuationBasic;
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    _.assign(options.headers, oauth.toHeader(oauth.authorize(valuationBasicCall)));
    return axios.post(valuationBasicCall.url, property, options)
    .then(function(response) {
        logAxiosResponse(reqId, response);
        return response;
    })
    .catch(function (error) {
        // logAxiosError(reqId, error);
        throw error;
    });
};

const getExpose = ( exposeId, reqId ) => {
    let exposeCall = _.cloneDeep(config.im24.calls.expose);
    exposeCall.url += exposeId;
    const options = {
        headers: {
            'Accept': 'application/json'
        }
    };
    _.assign(options.headers, oauth.toHeader(oauth.authorize(exposeCall)));
    return axios.get(exposeCall.url, options)
    .then(function(response) {
        logAxiosResponse(reqId, response);
        return response;
    })
    .catch(function (error) {
        const err = error.response.status === 404 ? new NotFoundError(error.response.status, error.message) : error;
        // logAxiosError(reqId, err);
        throw err;
    });
};

module.exports = {
    getValuationBasic,
    getExpose
};
