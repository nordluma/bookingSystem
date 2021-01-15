const mongoose = require("mongoose");

const { isOwner } = require("../middleware/Auth");
const Cabin = require("../models/cabin");

// @desc    Get all cabins
// @route   GET /cabins
// @access  Public
exports.getAllCabins = async (req, res, next) => {
    try {
        const cabins = await Cabin.find().populate({
            path: "owner",
            select: ["firstName", "lastName", "email"],
        });
        res.status(200).json(cabins);
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Get cabin by ID
// @route   GET /cabins/:id
// @access  Public
exports.getCabinById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cabin = await Cabin.findById(id).populate({
            path: "owner",
            select: ["_id", "firstName", "lastName", "email"],
        });
        return res.status(200).json(cabin);
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(err);
    }
};

// @desc    Add new cabin
// @route   POST /cabins
// @access  Protected
exports.addCabin = async (req, res, next) => {
    try {
        const { address, size, sauna, beach } = req.body;
        const cabin = new Cabin({
            _id: new mongoose.Types.ObjectId(),
            address,
            size,
            sauna,
            beach,
            owner: req.userData.userId,
        });

        const savedCabin = await cabin.save();
        return res
            .status(201)
            .json({ message: "Cabin succesfully created", savedCabin });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Update cabin info
// @route   PATCH /cabins/:id
// @access  Protected
exports.updateCabin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Cabin.findById(id);

        isOwner(owner.owner);

        const cabin = await Cabin.update(
            { _id: req.params.id },
            { $set: req.body }
        );
        return res.status(200).json({ message: "Cabin updated" });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Delete cabin
// @route   DELETE /cabins/:id
// @access  Protected
exports.deleteCabin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await Cabin.findById(id);

        isOwner(owner.owner);

        const cabin = await Cabin.remove({ _id: id });
        return res.status(200).json({ message: "Cabin deleted" });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};
