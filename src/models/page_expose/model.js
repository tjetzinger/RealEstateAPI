const mongoose = require('mongoose');
const { schema } = require('./schema');
const PageExpose = mongoose.model('PageExpose', schema);


module.exports = { PageExpose };
