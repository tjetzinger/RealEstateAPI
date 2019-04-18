const cb = (err) => { if(err) return err; };

const create = ({ Page }) => async (req, res, next) => {
    const page = req.body;

    try {
        Page.findByIdAndUpdate(page._id, page, { upsert: true }, cb);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { create };
