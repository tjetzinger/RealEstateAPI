const { APIError, InternalServerError, NotAcceptable } = require('rest-api-errors');
const { STATUS_CODES } = require('http');
const { logError } = require('./logger');

const errorHandler = (err, req, res, next) => {
    let error = (err.status === 401 || err instanceof APIError) ? err : new InternalServerError();
    if (err.name === 'ValidationError' || err.name === 'CastError')
        error = new NotAcceptable(406, err.message);

    if(process.env.NODE_ENV === 'dev' && error instanceof InternalServerError)
        console.log(err.stack || err.message);

    logError(req.id, error);
    return res
      .status(error.status)
      .json({
        code: error.code,
        message: error.message || STATUS_CODES[error.status],
      });
};

module.exports = { errorHandler };
