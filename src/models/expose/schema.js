const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const { im24 } = require('../../utils');

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
        required: true,
        trim: true
    },
    data: {
        type: Mixed,
        get:  getMongoMixedWithBadKeys,
        set:  setMongoMixedWithBadKeys
    }
}, options);

schema.pre('save', async function(next) {
    try {
        await this.fetchExpose(next);
        next();
    } catch (err) {
        next(err);
    }
});

schema.methods.fetchExpose = async function(next) {
    const exposeResponse = await im24.getExpose(this._id);
    this.data = exposeResponse.data["expose.expose"];
};

schema.virtual('pages', {
    ref: 'PageExpose',
    localField: '_id',
    foreignField: 'exposeId'
});

module.exports = { schema };
