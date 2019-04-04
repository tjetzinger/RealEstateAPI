const mongoose = require('mongoose');
const { schema } = require('./schema');
const UserProperty = mongoose.model('UserProperty', schema);


module.exports = { UserProperty };
