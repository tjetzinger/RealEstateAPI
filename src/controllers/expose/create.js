const _ = require('lodash');
const { storeExpose } = require('../../middleware');

const create = (models) => async (req, res, next) => {
    try {
        await storeExpose(models, req);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
