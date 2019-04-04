const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    timestamps: true,
};

const schema = new Schema({
    resultAbsolute: {
        type: Number,
        required: true
    },
    lowAbsolute: {
        type: Number,
        required: true
    },
    highAbsolute: {
        type: Number,
        required: true
    },
    resultPerSqm: {
        type: Number,
        required: true
    },
    lowPerSqm: {
        type: Number,
        required: true
    },
    highPerSqm: {
        type: Number,
        required: true
    },
    quickCheckAvailable: {
        type: Boolean
    },
    quickCheckLow: {
        type: Number
    },
    quickCheckHigh: {
        type: Number
    }
}, options);

module.exports = { schema };
