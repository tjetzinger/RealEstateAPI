const _ = require('lodash');
const Queue = require('better-queue');

const cb = (err) => { if(err) return err; };


const storeProperty = async ({ Page, Property, User }, req) => {
    const { page, user, property } = req.body;
    _.extend(property, { _id: Property.generateId(property)});

    Page.findByIdAndUpdate(page._id, { $set: page, $addToSet: { users: user } }, { new: true, upsert: true }, cb);
    User.findByIdAndUpdate(user._id, { $set: user, $addToSet: { pages: page, properties: property } }, {new: true, upsert: true }, cb);
    const _property = await Property.findByIdAndUpdate(property._id, { $set: property, $addToSet: { users: user } }, { new: true, upsert: true }, cb);
    await _property.save();

    return _property;
};


const storeExpose = async ({ Page, Expose }, req) => {
    const { pageId, exposes } = req.body;

    const exposeQueue = new Queue(async function (input, next) {
        Expose.findByIdAndUpdate(input.exposeId, { page: input.pageId }, { new: true, upsert: true }).then(async function(expose){
            await expose.save();
            if(expose.data)
                Page.findByIdAndUpdate(input.pageId, { $addToSet: { exposes: { expose: expose, topic: _.replace(expose.data.realEstate['@xsi.type'], 'expose:', '') } } }, cb);
        }).catch(function (err) {
            console.log(err.message);
        });
        next();
    });

    await Page.findByIdAndUpdate(pageId, { $set: { exposes: [] } }, { upsert: true }, cb);
    await Expose.deleteMany({ page: pageId }).exec();

    _.map(_.split(exposes, ','), (exposeId) => {
        exposeQueue.push({ pageId: pageId, exposeId: exposeId });
    });
};

module.exports = {
    storeProperty,
    storeExpose
};
