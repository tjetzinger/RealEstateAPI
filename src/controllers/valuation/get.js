const get = ({ Property }) => async (req, res, next) => {
    const { _id } = req.params;
    try {
        const property = await Property.findOne({ _id });
        res.status(200).send({ property: property });
    } catch (error) {
        next(error);
    }
};

module.exports= { get };
