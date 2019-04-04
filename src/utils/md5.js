const crypto = require('crypto');

const md5 = ( message ) => {
    return crypto.createHash('md5').update(message).digest("hex");
};

module.exports = {
    md5: md5
};
