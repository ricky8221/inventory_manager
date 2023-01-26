const asyncHandler = require("express-async-handler");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require ("../utils/sendEmail")


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
const getUser = asyncHandler( async (req, res) => {
    // res.send("Get User Profile");
    const user = await User.findById(req.user._id);

    if (user) {
        const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else {
        res.status(400);
        throw new Error ("User not found");
    }

});

// Get Login Status
const loginStatus = asyncHandler(async (req, res) => {
    // res.send("login");
    const token = req.cookies.token;

    if (!token) {
        return res.json(false);
    }

    // Verify Token
    const verifyed = jwt.verify(token, process.env.JWT_SECRET);

    if(verifyed) {
        return res.json(true);
    }
    return res.json(false);
});

// Update User
const updateUser = asyncHandler (async (req, res) => {
    // res.send("User Updated");
    const user = await User.findById(req.user._id);

    if (user){
        const {name, email, photo, phone, bio} = user;
        user.email = email;
        user.name = req.body.name || name;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.bio = req.body.bio || bio;

        const updatedUser = await user.save();

        res.status(200).json({
            name: updatedUser.name,
            email: updatedUser.email,
            photo: updatedUser.photo,
            phone: updatedUser.phone,
            bio: updatedUser.bio,
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// Change Password
const changePassword = asyncHandler (async (req, res) => {
    // res.send("Password Changed Successfully")
    const user = await User.findById(req.user._id);

    const {oldPassword, password} = req.body;

    // Check User
    if(!user) {
        res.status(400);
        throw new Error ("User not found, Please login");
    }

    // Validate
    if(!oldPassword || !password) {
        res.status(400);
        throw new Error ("Please provide old and new password");
    }

    // check if password match in DB
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    // Save new password
    if (user && isPasswordCorrect) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send("Password Changed Successfully");
    } else {
        res.status(400);
        throw new Error("Old password is incorrect");
    }
});

const forgotPassword = asyncHandler (async (req, res) => {
    // res.send("Forgot Password");
    const {email} = req.body;
    const user = await User.findOne({email});

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    } 

    // Delete Reset Token if it Exists in DB
    let token = await Token.findOne({userId: user._id});
    if (token) {
        await token.deleteOne()
    }

    // Create Reset Token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);

    // Hash Token Before Saving to DB
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save Token to DB
    await new Token({
        userId: user._id,
        token: hashToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000), // 30 mins
    }).save();

    // Construct Reset URL
    const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    // Reset Email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>Please use the url below to reset your password</p>
        <p>The link is valid only 30 minuts</p>
        
        <a href=${resetURL} clicktracking=off>${resetURL}</a>

        <p>Regards</p>
        <p>Inventory Manager</p>
    `;
    const subject = "Password Reset Request -- Inventory Manager";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({success: true,message: "Reset Email Sent"} )
    } catch (error) {
        res.status(500);
        throw new Error("Email Not Sent, please try again");
    };


});

const resetPassword = asyncHandler (async (req, res) => {
    // res.send("Reset Password")
    const {password} = req.body;
    const {resetToken} = req.params;

    // Hash Token Before then compare to Token in DB
    const hashToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Find Token in DB
    const userToken = await Token.findOne({
        token: hashToken,
        expiresAt: {$gt: Date.now()},
    })

    if (!userToken) {
        res.status(404);
        throw new Error("Invalide or expired token");
    }

    // Find User
    const user = await User.findOne({_id: userToken.userId});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        massage: "Password reset successfully, you can now login with you new password"
    });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
};