const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    page: {
        type: Number,
        ref: 'Page',
        required: true
    },
    userId: {
        type: Number,
        ref: 'User',
        required: true
    }
});

module.exports = { schema };
