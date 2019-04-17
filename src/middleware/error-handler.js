const { APIError, InternalServerError } = require('rest-api-errors');
const { STATUS_CODES } = require('http');

const errorHandler = (err, req, res, next) => {
    console.log(err.stack || err);
    const error = (process.env.NODE_ENV !== 'prod') ? err : new InternalServerError();

    return res
      .status(error.status || 500)
      .json({
        code: error.code || 500,
        message: error.message || STATUS_CODES[error.status],
      });
};

module.exports = { errorHandler };
