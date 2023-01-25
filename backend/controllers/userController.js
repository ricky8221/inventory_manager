const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};


// Register User
const registerUser = asyncHandler(async (req, res) => {
    // res.send("User Registered")
    const {name, email, password} = req.body;

    // Validation
    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please provide all required fileds");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be more than 6 character");
    }

    // Check if user email already exsists
    const userExsists = await User.findOne({email});

    if(userExsists) {
        res.status(400);
        throw new Error("Email already been registered");
    }

    // Encrypt password before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
        name, 
        email,
        password: hashedPassword
    });
    
    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie 
    res.cookie("token", token, {
        path: "/", 
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
        sameSite: "none",
        secure: true
    });

    if(user) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, name, email, photo, phone, bio, token
        });
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
    // res.send("Login user");
    const {email, password} = req.body;

    // Validate the request
    if(!email || !password) {
        res.status(400);
        throw new Error ("Please provide email and paasword");
    }

    // Check if user exists
    const user = await User.findOne({email});

    if(!user) {
        res.status(400);
        throw new Error ("User not found, please sign up");
    }

    // User exists, check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

        // Generate Token
        const token = generateToken(user._id);

        // Send HTTP-only cookie 
        res.cookie("token", token, {
            path: "/", 
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true
        });

    // check email and password is correct
    if (user && isPasswordCorrect) {
        const {_id, name, email, photo, phone, bio} = user
        res.status(200).json({
            _id, name, email, photo, phone, bio, token
        });
    } else {
        res.status(400);
        throw new Error ("invalide email or password");
    }

}); 

// Logout User 
const logoutUser = asyncHandler( async(req, res)=> {
    // res.send("User Logout!");
    res.cookie("token", "", {
        path: "/", 
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    return res.status(200).json({ message: "Logout Successfully" })
});

// Get User Profile
const getUser =asyncHandler( async (req, res) => {
    // res.send("Get User Profile");
    
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser
};