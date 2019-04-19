const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('config');
const helmet = require('helmet');
const addRequestId = require('express-request-id')();
const morgan = require('morgan');
const { MongoManager } = require('./src/mongo');
const index = require('./src/controllers');
const api = require('./src/api');
const { logRequest, logResponse, logError } = require('./src/middleware');

const app = express();
const mongoManager = new MongoManager();
mongoManager.connect();

Number.prototype.toCurrency = function(){
    return this.toLocaleString(config.locale.language, config.locale.currency).replace(',', '.');
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(addRequestId);

morgan.token('id', function getId(req) { return req.id; });
app.use(morgan(config.logging.format, { stream: process.stdout }));

app.use(function (req, res, next){
    logRequest(req);
    next();
});

// app.use(function (req, res, next) {
//     function afterResponse() {
//         res.removeListener('finish', afterResponse);
//         res.removeListener('close', afterResponse);
//         logResponse(req.id, '', res.status, res);
//     }
//     res.on('finish', afterResponse);
//     res.on('close', afterResponse);
//     next();
// });

app.use('/', index);
app.use('/api/v1', api());

// error handler
app.use(function(err, req, res, next) {
    logError(req.id, err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
