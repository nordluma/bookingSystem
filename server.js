const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config/.env" });

const connectDb = require("./config/db");
const advertRoutes = require("./routes/advert");
const bookingRoutes = require("./routes/booking");
const cabinRoutes = require("./routes/cabin");
const userRoutes = require("./routes/user");

connectDb();
const app = express();

//Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use("/adverts", advertRoutes);
app.use("/bookings", bookingRoutes);
app.use("/cabins", cabinRoutes);
app.use("/users", userRoutes);

//Error handling
app.use((req, res, next) => {
    const error = new Error(
        "Requested resource not found! Supported resources are /adverts, /bookings, /cabins and /users"
    );
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    console.log("triggers");
    res.status(error.status || 500).json({
        status: error.status,
        error: error.message,
    });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
