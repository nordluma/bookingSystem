const mongoose = require("mongoose");

const advertSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    cabin: { type: mongoose.Types.ObjectId, ref: "Cabin", required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Adverts", advertSchema);
