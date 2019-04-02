const _ = require('lodash');

const remove = ({ Valuation }, { config }) => async (req, res, next) => {
  const { _id } = req.params;
  try {
    const valuation = await Valuation.findOne({ _id });
    await Valuation.remove({ _id });
    res.status(200).send({ valuation: valuation });
  } catch (error) {
    next(error);
  }
};

module.exports= { remove };
