const dotent = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Route Middleware
app.use("/api/users", userRoute);

// ErrorMiddelware
app.use(errorHandler);

// Conect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Runing on port ${PORT}`);
        })
    })
    .catch((err) => console.log(err));