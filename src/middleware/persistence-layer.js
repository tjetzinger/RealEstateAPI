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

const storeExpose = async ({ Page, Expose }, req, next) => {
    const cb = (err) => { if(err) next(err); };
    const { pageId, exposes } = req.body;

    const _page = await Page.findByIdAndUpdate(pageId, { $set: { exposes: [] } }, { new: true, upsert: true }, cb);
    await Expose.deleteMany({ page: pageId }).exec();

    await Promise.all(_.map(_.split(exposes, ','), async (exposeId) => {
        const _expose = await Expose.findByIdAndUpdate(exposeId, { page: pageId }, { new: true, upsert: true }, cb);
        await _expose.save();
        _page.exposes.push({ expose: _expose, topic: _.replace(_expose.data.realEstate['@xsi.type'], 'expose:', '') });
    }));
    _page.save();
};

module.exports = {
    storeProperty,
    storeExpose
};
