const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    toJSON: { virtuals: true }
};

const schema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    }
}, options);

schema.virtual('users', {
    ref: 'PageUser',
    localField: '_id',
    foreignField: 'pageId'
});

schema.virtual('exposes', {
    ref: 'PageExpose',
    localField: '_id',
    foreignField: 'pageId'
});

module.exports = { schema };
