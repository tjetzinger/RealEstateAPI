const _ = require('lodash');

const remove = ({ Property }) => async (req, res, next) => {
    const { _id } = req.params;
    try {
        const property = await Property.findOne({ _id });
        await Property.remove({ _id });
        res.status(200).send({ property: property });
    } catch (error) {
        next(error);
    }
};

module.exports= { remove };
