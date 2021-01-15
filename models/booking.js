const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    cabin: { type: mongoose.Types.ObjectId, ref: "Cabin", required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    reserver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
