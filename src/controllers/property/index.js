const { Router: router } = require('express');
const { location } = require('./location');
const { valuation } = require('./valuation');

module.exports = (models) => {
    const api = router();
    api.post('/location', location(models));
    api.post('/valuation', valuation(models));
    return api;
};
