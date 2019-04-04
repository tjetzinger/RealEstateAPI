const mongoose = require('mongoose');
const { schema } = require('./schema');
const Valuation = mongoose.model('Valuation', schema);


module.exports = { Valuation };
