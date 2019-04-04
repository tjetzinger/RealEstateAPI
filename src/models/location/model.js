const mongoose = require('mongoose');
const { schema } = require('./schema');
const Location = mongoose.model('Location', schema);


module.exports = { Location };
