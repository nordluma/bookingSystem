const Advert = require("../models/advert");
const Booking = require("../models/booking");

exports.checkDates = async (req, res, next) => {
    const { cabin, from, to } = req.body;
    const advertDates = await Advert.find({ cabin: cabin });
    const existingBooking = await Booking.find({ cabin: cabin });

    let newStartDate = new Date(from).getTime();
    let newEndDate = new Date(to).getTime();

    try {
        advertDates.forEach((ad) => {
            let advertStartDate = new Date(ad.from).getTime();
            let advertEndDate = new Date(ad.to).getTime();
            checkadvertDates(
                newStartDate,
                newEndDate,
                advertStartDate,
                advertEndDate,
                next
            );
        });

        existingBooking.forEach((exist) => {
            let existingStartDate = new Date(exist.from).getTime();
            let existingEndDate = new Date(exist.to).getTime();
            checkBookingDates(
                newStartDate,
                newEndDate,
                existingStartDate,
                existingEndDate,
                next
            );
        });
        next();
    } catch (err) {
        const error = new Error("Booking could not be saved.");
        error.status = err.status || 500;
        next(error);
    }
};

const checkadvertDates = (nStart, nEnd, adStart, adEnd, next) => {
    try {
        if (adStart <= nEnd && nStart <= adEnd) {
            return;
        } else {
            res.status(400).json({
                message: "Cabin not available on the chosen dates",
            });
        }
    } catch (err) {
        const error = new Error("Cabin not available on the chosen dates");
        error.status = err.status || 400;
        next(error);
    }
};

const checkBookingDates = (nStart, nEnd, eStart, eEnd, next) => {
    try {
        if (eStart <= nEnd && nStart <= eEnd) {
            res.status(400).json({
                message: "Cabin is reserved on the chosen dates",
            });
        } else {
            return;
        }
    } catch (err) {
        const error = new Error("Cabin is reserved on the chosen dates");
        error.status = err.status || 400;
        next(error);
    }
};
