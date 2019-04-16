const { Router: router } = require('express');
const { list } = require('./list');
const { create } = require('./create');

module.exports = (models) => {
    const api = router();
    api.get('/:pageId', list(models));
    api.post('/', create(models));
    return api;
};
