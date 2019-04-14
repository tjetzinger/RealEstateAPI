const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    },
    users: [{
        type: Number,
        ref: 'User'
    }]
}, options);

schema.virtual('exposes', {
    ref: 'PageExpose',
    localField: '_id',
    foreignField: 'page'
});

module.exports = { schema };
