const cb = (err) => { if(err) return err; };

const get = ({ Expose }) => async (req, res, next) => {
    const { exposeId } = req.params;

    try {
        const _expose = await Expose.findById(exposeId, cb);
        if(!_expose) throw new Error('Expose: ' + exposeId + ' - Does not exist');

        res.status(200).send(_expose.detailMessage);
    } catch (error) {
        next(error);
    }
};

module.exports= { get };
