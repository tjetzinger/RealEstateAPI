const { InternalServerError } = require('rest-api-errors');
const { sendOne } = require('../../middleware');

const create = ({ Page, PageUser, Property, User, UserProperty }) => async (req, res, next) => {
    let error;
    const callbackHandler = ( err ) => {
        if(err) error = new InternalServerError(err.code, err.message);
    };

    try {
        const page = await Page.findByIdAndUpdate(req.body.page._id, req.body.page, { new: true, upsert: true }, callbackHandler);
        if(error) throw error;

        const user = await User.findByIdAndUpdate(req.body.user._id, req.body.user, {new: true, upsert: true }, callbackHandler);
        if(error) throw error;

        await PageUser.findOneAndUpdate({ pageId: page._id, userId: user._id }, {}, { upsert: true}, callbackHandler);
        if(error) throw error;

        let property = new Property(req.body.property);
        property = await Property.findByIdAndUpdate(property.id, req.body.property, { upsert: true }, callbackHandler);
        await property.save();
        if(error) throw error;

        await UserProperty.findOneAndUpdate({ userId: user._id, propertyId: property._id }, {}, { upsert: true }, callbackHandler);
        if(error) throw error;

        return sendOne(res, property.valuation);
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
