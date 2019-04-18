const get = ({ Page }) => async (req, res, next) => {
    const { exposeId } = req.params;

    try {
        res.status(200).send();
    } catch (error) {
        next(error);
    }
};

module.exports= { get };
