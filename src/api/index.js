const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('config');

const { errorHandler } = require('../middleware');
// list of models here
const { Page } = require('../models/page');
const { Property } = require('../models/property');
const { User } = require('../models/user');
const { Expose } = require('../models/expose');

// list of controllers here
const property = require('../controllers/property');
const expose = require('../controllers/expose');

// combine models into one object
const models = { Page, Property, User, Expose };

const routersInit = () => {
    const router = express();

    // add basic auth
    router.use( basicAuth({
        users: { [config.api.basicAuth.username]: config.api.basicAuth.password }
    }));

    // register api points
    router.use('/property', property(models));
    router.use('/expose', expose(models));

    // catch api all errors
    router.use(errorHandler);
    return router;
};

module.exports = routersInit;
