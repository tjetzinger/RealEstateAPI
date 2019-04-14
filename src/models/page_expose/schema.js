const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    timestamps: true
};

const schema = new Schema({
    page: {
        type: Number,
        ref: 'Page',
        required: true
    },
    expose: {
        type: Number,
        ref: 'Expose',
        required: true
    },
    rowId: {
        type: Number,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
}, options);

module.exports = { schema };
