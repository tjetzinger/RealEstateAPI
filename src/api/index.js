const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('config');

const { errorHandler } = require('../middleware');
// list of models here
const { Valuation } = require('../models/valuation');

// list of controllers here
const valuation = require('../controllers/valuation');

// combine models ino one object
const models = { Valuation };

const routersInit = () => {
  const router = express();

  // add basic auth
  router.use( basicAuth({
    users: { [config.api.basicAuth.username]: config.api.basicAuth.password }
  }));

  // register api points
  router.use('/valuation/basic', valuation(models));

  // catch api all errors
  router.use(errorHandler);
  return router;
};

module.exports = routersInit;
