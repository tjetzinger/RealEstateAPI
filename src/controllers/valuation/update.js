const _ = require('lodash');

const update = ({ Property }) => async (req, res, next) => {
    const { _id } = req.params;
    try {
        const property = await Property.findOne({ _id });
        _.extend(property, req.body);
        await property.save();
        res.status(200).send({ property: property });
    } catch (error) {
        next(error);
    }
};

module.exports= { update };
