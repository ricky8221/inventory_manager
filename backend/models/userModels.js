const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: [true],
        trim: true,
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be more than 6 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please provide a photo"],
        default: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
    },
    phone:  {
        type: String,
        default: "+1"
    },
    bio: {
        type: String,
        default: "Bio",
        maxLength: [250, "Bio can not be more than 250 character"]
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;