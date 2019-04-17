const mongoose = require('mongoose');
const _ = require('lodash');
const { im24 } = require('../../utils');
const { Page } = require('../page');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const setMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(setMongoMixedWithBadKeys)
        : typeof data === 'object'
        ? Object.entries(data).reduce((a, [key,value])=>({...a, [key.replace('.','__').replace('$','___')]:setMongoMixedWithBadKeys(value)}), {})
        : data;

const getMongoMixedWithBadKeys = data =>
    Array.isArray(data)
        ? data.map(getMongoMixedWithBadKeys)
        : typeof data === 'object'
        ? Object.entries(data).reduce((a, [key, value])=> ({...a, [key.replace('__','.').replace('___','$')]:getMongoMixedWithBadKeys(value)}), {})
        : data;

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
        console.log('Expose: ' + this._id + ' - ' + err.message);
        this.delete();
    }
});

schema.methods.fetchExpose = async function(companyWideCustomerId) {
    const _expose = await im24.getExpose(this._id);
    console.log('Expose: ' + this._id + ' - ' + 'Fetched...');
    if(companyWideCustomerId && companyWideCustomerId !== _expose.data["expose.expose"]["companyWideCustomerId"])
        throw new Error('Expose does not belong to realtor.');
    this.data = _expose.data["expose.expose"];
};

module.exports = { schema };
