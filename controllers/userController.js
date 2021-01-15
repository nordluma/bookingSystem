const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { isOwner } = require("../middleware/Auth");

// @desc    Get all users
// @route   GET /users
// @access  Private
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Update user
// @route   PATCH /users/:id
// @access  Protected
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await User.findById(id);

        isOwner(owner._id);

        const user = await User.update(
            { _id: req.params.id },
            { $set: req.body }
        );
        return res.status(200).json({ message: "User updated", user });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Protected
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const owner = await User.findById(id);

        isOwner(owner._id);

        const user = await User.remove({ _id: id });
        return res.status(200).json({ message: "User deleted" });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    User signup
// @route   POST /users/signup
// @access  Public
exports.userSignup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Check if user exists
        const emailExists = await User.findOne({ email });
        if (emailExists)
            return res.status(400).json({ message: "User already exists" });

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                res.status(500).json({
                    message: err,
                });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    firstName,
                    lastName,
                    email,
                    password: hash,
                });

                const savedUser = await user.save();
                res.status(201).json({ message: "User registered" });
            }
        });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    User login
// @route   POST /users/login
// @access  Public
exports.userLogin = async (req, res, next) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            res.status(401).json({ message: "Email or password is wrong" });

        // Check password
        const validPass = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPass) {
            return res
                .status(401)
                .json({ message: "Email or password is wrong" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Auth successfull", token });
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};

// @desc    Logout user
// @route   GET /users/logout
// @access  Protected
exports.userLogout = async (req, res, next) => {
    try {
        req.removeHeader("authorization");
        next();
    } catch (err) {
        const error = new Error(err);
        error.status = err.status || 500;
        next(error);
    }
};
