const dotent = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

const PORT = process.env.PORT || 5000;

// Conect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Runing on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));