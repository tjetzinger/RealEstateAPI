const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  street: {
    type: String,
    required: [true],
  },
  zip: {
    type: String,
    required: [true],
  },
  city: {
    type: String,
    required: [true],
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  realEstateTypeId: {
    type: Number,
    required: [true],
  },
  constructionYear: {
    type: Number,
    required: [true],
  },
  roomCountId: {
    type: Number,
    required: [true],
  },
  livingArea: {
    type: Number,
    required: [true],
  },
  siteArea: {
    type: Number,
  }
});

schema.set('timestamps', true);

schema.virtual('address').get(function () {
  return this.street + ", " + this.zip + ", " + this.city;
});

module.exports = { schema };
