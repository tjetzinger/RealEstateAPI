const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
    userId: {
        type: Number,
        ref: 'User',
        required: true
    },
    propertyId: {
        type: String,
        ref: 'Property',
        required: true
    }
});

module.exports = { schema };
