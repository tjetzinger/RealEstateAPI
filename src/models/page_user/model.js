const mongoose = require('mongoose');
const { schema } = require('./schema');
const PageUser = mongoose.model('PageUser', schema);


module.exports = { PageUser };
