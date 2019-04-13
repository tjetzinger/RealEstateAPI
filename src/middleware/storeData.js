const { InternalServerError } = require('rest-api-errors');

const storeProperty = async ({ Page, PageUser, Property, User, UserProperty }, req) => {
    let error;
    const callbackHandler = ( err ) => {
        if(err) error = new InternalServerError(err.code, err.message);
    };

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

    return property;
};

const storeExpose = async ({ Page, PageExpose, Expose }, req) => {
    let error;
    const callbackHandler = ( err ) => {
        if(err) error = new InternalServerError(err.code, err.message);
    };

    if (req.body.exposeId) {
        const page = await Page.findByIdAndUpdate(req.body.pageId, {}, { new: true, upsert:true }, callbackHandler);
        if(error) throw error;

        const expose = await Expose.findByIdAndUpdate(req.body.exposeId, {}, { new: true, upsert: true }, callbackHandler);
        await expose.save();
        if(error) throw error;

        const pageExpose = {
            pageId: page._id,
            exposeId: expose._id,
            rowId: req.body.rowId,
            topic: expose.data.realEstate["@xsi.type"]
        };
        await PageExpose.findOneAndUpdate({ pageId: page._id, exposeId: expose._id }, pageExpose, { upsert: true }, callbackHandler);
        if(error) throw error;
    }
    else {
        await PageExpose.findOneAndDelete({ pageId: req.body.pageId, rowId: req.body.rowId }, (err, pageExpose) => {
            if(err)
                error = new InternalServerError(err.code, err.message);
            else if(pageExpose)
                Expose.findOneAndDelete({ _id: pageExpose.exposeId }, (err) => { console.log(err); });
        });
        if(error) throw error;
    }
};

module.exports = {
    storeProperty,
    storeExpose
};
