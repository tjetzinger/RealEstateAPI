const express = require('express');
const basicAuth = require('express-basic-auth');
const config = require('config');

const { errorHandler } = require('../middleware');
// list of models here
const { Page } = require('../models/page');
const { PageUser } = require('../models/page_user');
const { Property } = require('../models/property');
const { User } = require('../models/user');
const { UserProperty } = require('../models/user_property');

// list of controllers here
const location = require('../controllers/location');
const property = require('../controllers/valuation');

// combine models into one object
const models = { Page, PageUser, Property, User, UserProperty };

const routersInit = () => {
    const router = express();

    // add basic auth
    router.use( basicAuth({
        users: { [config.api.basicAuth.username]: config.api.basicAuth.password }
    }));

    // register api points
    router.use('/location', location(models));
    router.use('/valuation/basic', property(models));

    // catch api all errors
    router.use(errorHandler);
    return router;
};

module.exports = routersInit;
