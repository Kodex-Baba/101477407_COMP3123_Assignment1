const express = require("express");
const Users = require("../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import JWT
const { body, validationResult } = require("express-validator");

// POST /api/v1/user/signup
router.post("/user/signup", [
    body("username").notEmpty().withMessage("Username is required."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
], async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({
            message: "User created successfully.",
            user_id: newUser._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user.", error });
    }
});

// POST /api/v1/user/login
// User login
router.post("/user/login", [
    body("email").isEmail().withMessage("Invalid email address."),
    body("password").notEmpty().withMessage("Password is required.")
], async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate a token if using JWT (optional)
        const token = jwt.sign({ id: user._id },
            "your_jwt_secret",
            { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", jwt_token: token }); // Optionally include the token
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
