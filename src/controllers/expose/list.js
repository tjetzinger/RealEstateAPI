const _ = require('lodash');

const list = ({ Page }) => async (req, res, next) => {
    const { pageId } = req.params;
    const { topic } = req.query;

    try {
        const _page = await Page.findOne({ _id: pageId }).populate('exposes.expose');
        const _exposes = _.filter(_page.exposes, (expose) => {
            return new RegExp(topic, 'i').test(expose.topic);
        });

        res.status(200).send(_exposes);
    } catch (error) {
        next(error);
    }
};

module.exports= { list };
