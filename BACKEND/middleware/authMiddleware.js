
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    console.log("PROTECT MIDDLEWARE RUNNING");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Not authorized, token missing"
        });
    }

    const token = authHeader.substring(7).trim();

    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in middleware");
            return res.status(500).json({
                message: "JWT configuration error"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.error("JWT Verification Error:", error.message);

        return res.status(401).json({
            message: "Not authorized, invalid token"
        });
    }
};

module.exports = protect;