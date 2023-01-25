const { default: mongoose } = require("mongoose");

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    }
})

const Token = mongoose.modle("Token", tokenSchema);

module.exports = Token;