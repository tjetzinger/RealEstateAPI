const { NotFoundError } = require('rest-api-errors');
const { logResponse } = require('../../middleware');

const cb = (err) => { if(err) return err; };

const get = ({ Expose }) => async (req, res, next) => {
    const { exposeId } = req.params;

    try {
        const _expose = await Expose.findById(exposeId, cb);
        if(!_expose) throw new NotFoundError( 404, 'Expose: ' + exposeId + ' - Does not exist');

        const response = _expose.detailMessage;
        logResponse(req.id, res, response);
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
};

module.exports= { get };
