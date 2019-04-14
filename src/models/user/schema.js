const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {
    timestamps: true
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
    },
    pages: [{
        type: Number,
        ref: 'Page'
    }],
    properties: [{
        type: String,
        ref: 'Property'
    }]
}, options);

module.exports = { schema };
