const jwt = require("jsonwebtoken");


const requireAuth = (req, res, next) => {


  
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authorization token missing or Invalid"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user payload (userId and role) to request object
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or  expired token"
        });
    }

}


module.exports = {
      requireAuth
};