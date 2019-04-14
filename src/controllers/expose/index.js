const { Router: router } = require('express');
const { list } = require('./list');

module.exports = (models) => {
    const api = router();
    api.get('/rent/:_id', list(models, 'rent'));
    api.get('/buy/:_id', list(models, 'buy'));
    return api;
};
