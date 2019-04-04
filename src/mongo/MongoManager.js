const mongoose = require('mongoose');
const config = require('config');

class MongoManager {
    connect() {
        const options = {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        };
        return mongoose.connect(config.mongodb.uri, options);
    }
}

module.exports = { MongoManager };
