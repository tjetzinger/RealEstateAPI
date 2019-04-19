const mongoose = require('mongoose');
const _ = require('lodash');
const config = require('config');
const { PreconditionFailed } = require('rest-api-errors');
const { im24 } = require('../../utils');
const { logError } = require('../../middleware');
const { Page } = require('../page');
const { setMongoMixedWithBadKeys, getMongoMixedWithBadKeys } = require('../../mongo/storeMixedObjects');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const options = {
    timestamps: true,
};

const schema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    page: {
        type: Number,
        ref: 'Page'
    },
    data: {
        type: Mixed,
        get:  getMongoMixedWithBadKeys,
        set:  setMongoMixedWithBadKeys
    }
}, options);

schema.pre('save', async function(next) {
    try {
        const _page = await Page.findOne({ _id: this.page }).populate('Page');
        await this.fetchExpose(_page.companyWideCustomerId);
        next();
    } catch (err) {
        logError(this.$reqId, err);
        this.delete();
    }
});

schema.methods.fetchExpose = async function(companyWideCustomerId) {
    const _expose = await im24.getExpose(this._id, this.$reqId);
    if(_expose) {
        if(companyWideCustomerId && companyWideCustomerId !== _expose.data["expose.expose"]["companyWideCustomerId"])
            throw new PreconditionFailed(412, 'Expose does not belong to realtor.');
        this.data = _expose.data["expose.expose"];
    }
};

schema.virtual('title').get(function () {
    return this.data.realEstate.title;
});

schema.virtual('titleSub').get(function () {
    const address = this.data.realEstate.address,
          price = this.data.realEstate.price,
          space = this.data.realEstate.livingSpace;

    let subTitle = '';
    subTitle += address ? address.city === address.quarter ? address.city + '\n' : address.city + ' - ' + address.quarter + '\n' : '';
    subTitle += price ? price.value.toCurrency() + '\n' : '';
    subTitle += space ? space + ' qm Wohnfläche' : '';
    return subTitle;
});

schema.virtual('titleImage').get(function () {
    return this.data.realEstate.titlePicture.urls[0].url[3]['@href'];
});

schema.virtual('titleCard').get(function () {
    let card = _.cloneDeep(config.messages.exposeCard);
    card.title = this.title;
    card.subtitle = this.titleSub;
    card.image_url = this.titleImage;
    card.buttons[0].url += this._id;
    return card;
});

schema.virtual('detailMessage').get(function () {
    let container = _.cloneDeep(config.messages.container);
    let note = _.cloneDeep(config.messages.text);

    if(_.hasIn(this.data.realEstate, 'attachments[0].attachment')) {
        const _galleries = _.chunk(this.data.realEstate.attachments[0].attachment, 10);
        _.forEach(_galleries, function (_gallery) {
            let gallery = _.cloneDeep(config.messages.gallery);

            _.forEach(_gallery, function (_attachment) {
                let attachment = _.cloneDeep(config.messages.card);
                attachment.title = _attachment.title;
                attachment.image_url = _attachment.urls[0].url[3]['@href'];
                gallery.elements.push(attachment);
            });
            container.content.messages.push(gallery);
        });
    }

    note.text = _.truncate(this.data.realEstate.descriptionNote, { 'length': 640, 'separator': '.' });
    container.content.messages.push(note);
    return container;
});

module.exports = { schema };
