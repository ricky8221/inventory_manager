const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
// const { default: userEvent } = require("@testing-library/user-event");

const protect = asyncHandler (async(req, res, next) => {
    try {
        const token  = req.cookies.token;
        if (!token) {
            res.status(401);
            throw new Error("Not authorized, please login")
        }

        // Verify Token
        const verifyed = jwt.verify(token, process.env.JWT_SECRET);

        // Get User ID From Token
        const user = await User.findById(verifyed.id).select("-password");
        
        if(!user) {
            res.status(400);
            throw new Error ("User not found");
        }
        req.user = user
        next(); 
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, please login");
    }
});


module.exports = protect;