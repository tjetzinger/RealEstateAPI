const mongoose = require('mongoose');
const config = require('config');

class MongoManager {
  connect () {
    return mongoose.connect(config.mongodb.uri);
  }
}

module.exports = { MongoManager };