const { Router: router } = require('express');
const { get } = require('./get');
const { list } = require('./list');
const { create } = require('./create');

module.exports = (models) => {
    const api = router();
    api.get('/:exposeId', get(models));
    api.get('/list/:pageId', list(models));
    api.post('/', create(models));
    return api;
};
