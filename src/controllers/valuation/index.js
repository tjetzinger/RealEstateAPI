const { Router: router } = require('express');

// const { get } = require('./get');
// const { list } = require('./list');
const { create } = require('./create');
// const { update } = require('./update');
// const { remove } = require('./remove');


/**
 * Provide api for valuation
 *
 *
 * GET /api/v1/valuation/basic - List
     @header
            Authorization: Bearer {token}
     @optionalQueryParameters
           search {String} - value to search
           limit {Number} - count of item to send
           skip {Number} - value to search
 *
 *
 * **/

module.exports = (models) => {
  const api = router();

  //api.get('/', list(models, { config }));
  //api.get('/:_id', get(models, { config }));
  api.post('/', create(models));
  //api.patch('/:_id', update(models, { config }));
  //api.delete('/:_id', remove(models, { config }));

  return api;
};
