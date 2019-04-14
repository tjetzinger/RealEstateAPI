const _ = require('lodash');


const storeProperty = async ({ Page, Property, User }, req, next) => {
    const cb = (err) => { if(err) next(err); };
    const { page, user, property } = req.body;
    _.extend(property, { _id: Property.generateId(property)});

    Page.findByIdAndUpdate(page._id, { $set: page, $addToSet: { users: user } }, { new: true, upsert: true }, cb);
    User.findByIdAndUpdate(user._id, { $set: user, $addToSet: { pages: page, properties: property } }, {new: true, upsert: true }, cb);
    const _property = await Property.findByIdAndUpdate(property._id, { $set: property, $addToSet: { users: user } }, { new: true, upsert: true }, cb);
    await _property.save();

    return _property;
};

const storeExpose = async ({ Page, PageExpose, Expose }, req, next) => {
    const cb = (err) => { if(err) next(err); };
    const { pageId, rowId, exposeId } = req.body;

    if (exposeId) {
        Page.findByIdAndUpdate(pageId, {}, { new: true, upsert:true }, cb);

        const _expose = await Expose.findByIdAndUpdate(exposeId, {}, { new: true, upsert: true }, cb);
        await _expose.save();

        const pageExpose = {};
        _.extend(pageExpose, { page: pageId });
        _.extend(pageExpose, { expose: exposeId });
        _.extend(pageExpose, { rowId: rowId });
        _.extend(pageExpose, { topic: _expose.data.realEstate["@xsi.type"] });
        await PageExpose.findOneAndUpdate({ page: pageId, rowId: rowId }, pageExpose, { upsert: true }, cb);
    }
    else {
        await PageExpose.findOneAndDelete({ page: pageId, rowId: rowId }, (err, pageExpose) => {
            if(err)
                next(err);
            else if(pageExpose)
                Expose.findOneAndDelete({ _id: pageExpose.expose }, cb);
        });
    }
};

module.exports = {
    storeProperty,
    storeExpose
};
