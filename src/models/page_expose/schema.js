const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    timestamps: true
};

const schema = new Schema({
    pageId: {
        type: Number,
        ref: 'Page',
        required: true
    },
    exposeId: {
        type: Number,
        ref: 'Expose',
        required: true,
        trim: true
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
