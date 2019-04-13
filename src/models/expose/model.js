const mongoose = require('mongoose');
const { schema } = require('./schema');
const Expose = mongoose.model('Expose', schema);


module.exports = { Expose };
