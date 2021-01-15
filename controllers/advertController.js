const mongoose = require("mongoose");

const { isOwner } = require("../middleware/Auth");
const Advert = require("../models/advert");

// @desc    Get all adverts
// @route   GET /adverts
// @access  Public
exports.getAllAdverts = async (req, res, next) => {
    try {
        const advert = await Advert.find().populate("cabin");
        return res.status(200).json(advert);
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Get advert by id
// @route   GET /adverts/:id
// @access  Public
exports.getAdvertById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const advert = await Advert.findById(id).populate("cabin");
        return res.status(200).json(advert);
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Post advert
// @route   POST /adverts
// @access  Protected
exports.addAdvert = async (req, res, next) => {
    try {
        const { cabin, from, to } = req.body;

        const advert = new Advert({
            _id: mongoose.Types.ObjectId(),
            cabin,
            from,
            to,
            owner: req.userData.userId,
        });
        const savedAdvert = await advert.save();
        return res.status(201).json({ message: "Advert created", savedAdvert });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Update advert
// @route   PATCH /adverts/:id
// @access  Protected
exports.updateAdvert = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Advert.findById(id);

        isOwner(owner.owner);

        const advert = await Advert.update(
            { _id: req.params.id },
            { $set: req.body }
        );
        return res.status(200).json({ message: "Advert updated", advert });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Delete advert
// @route   DELETE /adverts/:id
// @access  Protected
exports.deleteAdvert = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Advert.findById(id);

        isOwner(owner.owner);

        const advert = await Advert.remove({ _id: id });
        return res.status(200).json({ message: "Advert deleted" });
    } catch (err) {
        console.log(err);
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};
