const mongoose = require('mongoose');
const { schema } = require('./schema');
const Property = mongoose.model('Property', schema);


module.exports = { Property };
