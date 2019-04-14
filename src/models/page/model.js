const mongoose = require('mongoose');
const { schema } = require('./schema');

const Page = mongoose.model('Page', schema);

module.exports = { Page };
