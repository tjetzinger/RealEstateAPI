const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('config');

const { errorHandler } = require('../middleware');
// list of models here
const { Property } = require('../models/property');

// list of controllers here
const property = require('../controllers/valuation');

// combine models ino one object
const models = { Property };

const routersInit = () => {
  const router = express();

  // add basic auth
  router.use( basicAuth({
    users: { [config.api.basicAuth.username]: config.api.basicAuth.password }
  }));

  // register api points
  router.use('/valuation/basic', property(models));

  // catch api all errors
  router.use(errorHandler);
  return router;
};

module.exports = routersInit;
