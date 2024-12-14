const userAgentResponse = (req, res, next) => {
    const userAgent = req.headers['user-agent'];

    const originalJson = res.json;

    res.json = function (body) {
        body.userAgent = userAgent;

        originalJson.call(this, body);
    };

    next();
};

export default userAgentResponse;
