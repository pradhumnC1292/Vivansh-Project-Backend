import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { validationResult } from "express-validator";

import {
  ValidationError,
  DuplicateKeyError,
  ServerError,
} from "../utils/customErrors.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// REGISTER A NEW USER

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError("Validation failed", errors.array());
  }

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new DuplicateKeyError("User already exists", "email"));
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id, user.role);
    console.log("Generated Token:", token);
    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ token, user: { id: user._id, name, email, role } });
  } catch (error) {
    console.error("Error in registerUser:", error);
    next(new ServerError("Server error"));
  }
};

// LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch || user.role !== role) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // if (user && (await user.matchPassword(password))) {
    //   const token = generateToken(user._id, user.role);
    //   console.log("Generated Token:", token);
    //   res.cookie("token", token, cookieOptions).json({
    //     token,
    //     user: { id: user._id, name: user.name, email, role: user.role },
    //   });
    // } else {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }
    // Generate token if credentials are valid
    const token = generateToken(user._id, user.role);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        token,
        user: { id: user._id, name: user.name, email, role: user.role },
      });
  } catch (error) {
    // return res
    //   .status(error.statusCode || 500)
    //   .json({ message: error.message || "Server error" });
    console.error("Error during login:", error);
    next(new ServerError("Server error"));
  }
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  res
    .cookie("token", "", { maxAge: 0, httpOnly: true })
    .json({ message: "User logged out" });
};
