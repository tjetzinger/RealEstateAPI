const { Router: router } = require('express');
const { create } = require('./create');

module.exports = (models) => {
    const api = router();
    api.post('/', create(models));
    return api;
};
