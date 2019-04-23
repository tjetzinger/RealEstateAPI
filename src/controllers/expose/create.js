const _ = require('lodash');
const { storeExposes, logResponse } = require('../../middleware');

const create = (models) => async (req, res, next) => {
    try {
        await storeExposes(models, req);

        logResponse(req.id, res, '');
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
