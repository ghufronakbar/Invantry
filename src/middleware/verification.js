import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../constant/index.js'
import Response from '../helper/response.js'

const verification = (roles) => async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        if (!bearerToken) {
            return res.status(401).json(Response.unauthorized())
        }
        const token = bearerToken.replace(/^Bearer\s+/, "");
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json(Response.unauthorized())
            }
            if (!decoded) {
                return res.status(401).json(Response.unauthorized())
            }
            if (roles.includes(decoded.role)) {
                req.decoded = decoded
                next()
            } else {
                return res.status(401).json(Response.unauthorized())
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(Response.error())
    }

}

export default verification