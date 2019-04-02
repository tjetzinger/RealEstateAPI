const express = require('express');
const basicAuth = require('express-basic-auth');

const { errorHandler } = require('../middleware');
// list of models here
const { Valuation } = require('../models/valuation');

// list of controllers here
const valuation = require('../controllers/valuation');

// combine models ino one object
const models = { Valuation };

const routersInit = config => {
  const router = express();

  // add basic auth
  router.use( basicAuth({
    users: { 'admin': 'supersecret' }
  }));

  // register api points
  router.use('/valuation/basic', valuation(models, { config }));

  // catch api all errors
  router.use(errorHandler);
  return router;
};

module.exports = routersInit;
