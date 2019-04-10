const { errorHandler } = require('./error-handler');
const { sendOne } = require('./requests-helpers');
const { storeProperty } = require('./storeData');

module.exports = { errorHandler, sendOne, storeProperty };
