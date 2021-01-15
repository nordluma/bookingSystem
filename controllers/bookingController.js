const mongoose = require("mongoose");

const { isOwner } = require("../middleware/Auth");
const Booking = require("../models/booking");

// @desc    Get all reservations
// @route   GET /bookings
// @access  Public
exports.getAllBookings = async (req, res, next) => {
    try {
        const booking = await Booking.find()
            .populate("cabin")
            .populate({
                path: "reserver",
                select: ["_id", "firstName", "lastName", "email"],
            });
        return res.status(200).json(booking);
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Get reservation by id
// @route   GET /bookings/:id
// @access  Public
exports.getBookingById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate("cabin")
            .populate("reserver");
        return res.status(200).json(booking);
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Post new reservation
// @route   POST /bookings
// @access  Protected
exports.addBooking = async (req, res, next) => {
    try {
        const { cabin, from, to } = req.body;

        const booking = new Booking({
            _id: mongoose.Types.ObjectId(),
            cabin,
            from,
            to,
            reserver: req.userData.userId,
        });
        const savedBooking = await booking.save();
        return res
            .status(201)
            .json({ message: "Reservation created", savedBooking });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Update reservation
// @route   PATCH /bookings/:id
// @access  Protected
exports.updateBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Booking.findById(id);

        isOwner(owner.reserver);

        const booking = await Booking.update({ _id: id }, { $set: req.body });
        return res
            .status(200)
            .json({ message: "Reservation updated", booking });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Delete reservation
// @route   DELETE /bookings/:id
// @access  Protected
exports.deleteBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Booking.findById(id);

        isOwner(owner.reserver);

        const booking = await Booking.remove({ _id: id });
        return res.status(200).json({ message: "Advert deleted", booking });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};
