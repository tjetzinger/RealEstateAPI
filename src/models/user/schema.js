const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    timestamps: true,
    toJSON: { virtuals: true }
};

const schema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String
    }
}, options);

schema.virtual('pages', {
    ref: 'PageUser',
    localField: '_id',
    foreignField: 'userId'
});

schema.virtual('properties', {
    ref: 'UserProperty',
    localField: '_id',
    foreignField: 'userId'
});

module.exports = { schema };
