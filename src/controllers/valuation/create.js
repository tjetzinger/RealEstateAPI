const { sendOne, storeProperty } = require('../../middleware');

const create = (models) => async (req, res, next) => {
    try {
        const property = await storeProperty(models, req);
        return sendOne(res, property.responseValuation);
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
