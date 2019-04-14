const _ = require('lodash');

const list = ({ PageExpose, Expose }) => async (req, res, next) => {
    const { pageId } = req.params;
    const { topic } = req.query;

    try {
        const query = {};
        _.extend(query, { pageId: pageId });
        _.extend(query, { topic: new RegExp(`${topic}`, 'i') });
        const exposes = await PageExpose.find(query).populate('exposeId');

        res.status(200).send(exposes);
    } catch (error) {
        next(error);
    }
};

module.exports= { list };
