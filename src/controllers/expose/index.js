const { Router: router } = require('express');
const { list } = require('./list');

module.exports = (models) => {
    const api = router();
    api.get('/:pageId', list(models));
    return api;
};
