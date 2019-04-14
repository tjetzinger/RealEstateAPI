const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('config');

const { errorHandler } = require('../middleware');
// list of models here
const { Page } = require('../models/page');
const { Property } = require('../models/property');
const { User } = require('../models/user');
const { Expose } = require('../models/expose');
const { PageExpose } = require('../models/page_expose');

// list of controllers here
const location = require('../controllers/location');
const property = require('../controllers/valuation');
const expose = require('../controllers/expose');
const page = require('../controllers/page');

// combine models into one object
const models = { Page, Property, User, Expose, PageExpose };

const routersInit = () => {
    const router = express();

    // add basic auth
    router.use( basicAuth({
        users: { [config.api.basicAuth.username]: config.api.basicAuth.password }
    }));

    // register api points
    router.use('/location', location(models));
    router.use('/valuation/basic', property(models));
    router.use('/expose', expose(models));
    router.use('/page', page(models));

    // catch api all errors
    router.use(errorHandler);
    return router;
};

module.exports = routersInit;
