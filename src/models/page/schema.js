const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    companyWideCustomerId: {
        type: String
    },
    users: [{
        type: Number,
        ref: 'User'
    }],
    exposes: [new Schema({
        expose: {
            type: Number,
            ref: 'Expose'
        },
        topic: {
            type: String,
            required: true
        }
    }, { _id:false })]
});

module.exports = { schema };
