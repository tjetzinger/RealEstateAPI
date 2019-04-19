const { sendOne, storeProperty, logResponse } = require('../../middleware');

const valuation = (models) => async (req, res, next) => {
    try {
        const property = await storeProperty(models, req);
        const response = property.responseValuation;
        logResponse(req.id, res, response);
        return sendOne(res, response);
    } catch (error) {
        next(error);
    }
};

module.exports = { valuation };
