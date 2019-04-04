const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const options = {
    timestamps: true,
};

const schema = new Schema({
    latitude: {
        type: Number,
        required: true,
        alias: 'lat'
    },
    longitude: {
        type: Number,
        required: true,
        alias: 'lng'
    }
}, options);

module.exports = { schema };
