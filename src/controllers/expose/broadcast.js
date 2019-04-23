const _ = require('lodash');
const config = require('config');
const { NotFoundError } = require('rest-api-errors');
const { logResponse } = require('../../middleware');

const broadcast = ({ Page, User, Expose }) => async (req, res, next) => {
    const { pageId, userId } = req.params;
    const { topic } = req.query;

    try {
        const _user = await User.findOne({ _id: userId });
        if(!_user) throw new NotFoundError( 404, 'User: ' + userId + ' - Does not exist');
        const _page = await Page.findOne({ _id: pageId });
        if(!_page) throw new NotFoundError( 404, 'Page: ' + pageId + ' - Does not exist');

        const _broadcastedExposes = _user.bradcastedExposes;
        const _exposes = _.map(_.filter(_page.exposes, (expose) => { return new RegExp(topic, 'i').test(expose.topic); }), 'expose');
        const exposeId = _.sample(_.difference(_exposes, _broadcastedExposes));

        const _expose = await Expose.findOne({ _id: exposeId });
        if(!_expose) throw new NotFoundError( 404, 'Expose: ' + exposeId + ' - Does not exist');
        const body = _expose.detailMessage;

        logResponse(req.id, res, body);
        res.status(200).send(body);
    } catch (error) {
        next(error);
    }
};

module.exports= { broadcast };
