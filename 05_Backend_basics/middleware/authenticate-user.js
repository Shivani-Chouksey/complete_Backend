import jwt from 'jsonwebtoken'
export const AuthenticateUserMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "")
        // console.log("token -->", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized ", Success: false })
        }

        const decode_Token_value = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decode_Token_value -->", decode_Token_value);
        req.user = decode_Token_value
        next()
    } catch (error) {
        // console.log("error -->", error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            return res.status(403).json({ message: 'Invalid access token' });
        }
    }
}