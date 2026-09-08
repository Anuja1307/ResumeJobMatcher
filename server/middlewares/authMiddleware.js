const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: no token provided"
        });
    }

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        if (!decoded.userId) {
    return res.status(401).json({
        success: false,
        message: "Unauthorized: invalid token payload"
    });
}

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: invalid or expired token"
        });
    }
};

module.exports = protect;