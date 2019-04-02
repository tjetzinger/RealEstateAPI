const _ = require('lodash');

const update = ({ Valuation }, { config }) => async (req, res, next) => {
  const { _id } = req.params;
  try {
    const valuation = await Valuation.findOne({ _id });
    _.extend(valuation, req.body);
    await valuation.save();
    res.status(200).send({ valuation: valuation });
  } catch (error) {
    next(error);
  }
};

module.exports= { update };
