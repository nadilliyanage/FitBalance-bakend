const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authHelper");

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validation
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and must be at least 6 characters long",
      });
    }
    // Existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered with this email",
      });
    }

    // Hashed password
    const hashedPassword = await hashPassword(password);

    // Save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please provide email and password",
      });
    }
    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // Match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Token JWT
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Undefined password
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

// Logout
const logoutController = (req, res) => {
  try {
    // Invalidate the JWT token (Typically done on client-side, not server-side)
    // For demo purposes, just sending a success message
    res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in logout API",
      error,
    });
  }
};

module.exports = { registerController, loginController, logoutController };
