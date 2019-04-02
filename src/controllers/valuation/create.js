const { NotAcceptable } = require('rest-api-errors');
const { sendOne } = require('../../middleware');
const _ = require('lodash');

const create = ({ Valuation }, { config }) => async (req, res, next) => {
  try {
    const valuation = new Valuation();
    // if (!req.body.title) {
    //   throw new NotAcceptable(405, 'Should by title}');
    // }
    _.extend(valuation, req.body);
    await valuation.save();

    return sendOne(res, { valuation: valuation });
  } catch (error) {
    next(error);
  }
};

module.exports = { create };
