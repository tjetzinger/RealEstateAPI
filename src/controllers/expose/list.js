const _ = require('lodash');
const config = require('config');
const { NotFoundError } = require('rest-api-errors');
const { logResponse } = require('../../middleware');

const list = ({ Page }) => async (req, res, next) => {
    const { pageId } = req.params;
    const { topic } = req.query;

    try {
        const _page = await Page.findOne({ _id: pageId }).populate('exposes.expose');
        if(!_.hasIn(_page, 'exposes')) throw new NotFoundError(404, 'Page: ' + pageId + ' - No exposes');

        const _exposes = _.filter(_page.exposes, (expose) => {
            return new RegExp(topic, 'i').test(expose.topic);
        });

        if(!_exposes.length > 0) throw new NotFoundError(404, 'Page: ' + pageId + ' - No Exposes available - Filter: ' + topic);

        let container = _.cloneDeep(config.messages.container);
        const _galleries = _.chunk(_exposes, 10);
        _.forEach(_galleries, function (_gallery) {
            let gallery = _.cloneDeep(config.messages.gallery);
            _.forEach(_gallery, function(_card) {
                gallery.elements.push(_card.expose.titleCard);
            });
            container.content.messages.push(gallery);
        });

        logResponse(req.id, res, container);
        res.status(200).send(container);
    } catch (error) {
        next(error);
    }
};

module.exports= { list };
