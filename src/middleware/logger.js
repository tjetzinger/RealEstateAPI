const fs = require('fs');
const config = require('config');
const bunyan = require('bunyan');
const serializers = require('bunyan-axios-serializer');

const safeCycles = bunyan.safeCycles;

function SpecificLevelStream(levels, stream) {
    let self = this;
    this.levels = {};
    levels.forEach(function (lvl) {
        self.levels[bunyan.resolveLevel(lvl)] = true;
    });
    this.stream = stream;
}

SpecificLevelStream.prototype.write = function (rec) {
    if (this.levels[rec.level] !== undefined) {
        const str = JSON.stringify(rec, safeCycles()) + '\n';
        this.stream.write(str);
    }
};

const streams = [
    {
        level: 'trace',
        type: 'raw',
        stream: new SpecificLevelStream(['trace'], fs.createWriteStream(config.logging.trace.path, {flags: 'a', encoding: 'utf8'})),
        period: config.logging.trace.period,
        count: config.logging.trace.count
    },
    {
        level: 'debug',
        type: 'raw',
        stream: new SpecificLevelStream(['debug'], fs.createWriteStream(config.logging.debug.path, {flags: 'a', encoding: 'utf8'})),
        period: config.logging.debug.period,
        count: config.logging.debug.count
    },
    {
        level: 'info',
        type: 'raw',
        stream: new SpecificLevelStream(['info'], process.stdout)
    },
    {
        level: 'warn',
        path: config.logging.error.path,
        period: config.logging.error.period,
        count: config.logging.error.count
    }
];

const logger = bunyan.createLogger({
    name: 'RealEstateAPI-' + process.env.NODE_ENV,
    serializers: {
        req: require('bunyan-express-serializer'),
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err
    },
    streams: streams
});

const axiosLogger = bunyan.createLogger({
    name: 'RealEstateAPI-' + process.env.NODE_ENV,
    serializers: serializers,
    streams: streams
});

const logRequest = function (req) {
    const log = logger.child({ id: req.id }, true);
    log.debug({req: req, body: req.body}, 'reapi request');
};

const logResponse = function (id, res, body) {
    const log = logger.child({ id: id }, true);
    log.debug({res: res}, 'reapi response');
};

const logError = function (id, err) {
    const log = logger.child({ id: id }, true);
    log.error({err: err, status: err.status || 500}, 'reapi error');
};

const logAxiosResponse = function (id, res) {
    const log = axiosLogger.child({ id: id }, true);
    log.debug({res: res}, 'axios response');
};

const logAxiosError = function (id, err) {
    const log = axiosLogger.child({ id: id }, true);
    log.error({err: err, status: err.status || err.response.status || 500}, 'axios error');
};

module.exports = {
    logRequest,
    logResponse,
    logError,
    logAxiosResponse,
    logAxiosError
};
