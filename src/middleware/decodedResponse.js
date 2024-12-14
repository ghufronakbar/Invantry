const decodedResponse = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (body) {
        if (req.decoded) {
            body.decoded = req.decoded;
        }

        originalJson.call(this, body);
    };

    next();
};

export default decodedResponse;
