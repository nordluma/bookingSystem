const mongoose = require("mongoose");

const cabinSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    address: { type: String, required: true },
    size: { type: Number, required: true },
    sauna: Boolean,
    beach: Boolean,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("Cabin", cabinSchema);
