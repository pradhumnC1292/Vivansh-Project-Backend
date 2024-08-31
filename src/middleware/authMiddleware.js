// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // Middleware to protect routes

// export const protect = async (req, res, next) => {
//   let token;

//   if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Middleware for role-based access

// export const superAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "Super Admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as Super Admin" });
//   }
// };

// export const admin = (req, res, next) => {
//   if (req.user && req.user.role === "Admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as admin" });
//   }
// };

// export const manager = (req, res, next) => {
//   if (req.user && (req.user.role === "Admin" || req.user.role === "Manager")) {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as manager" });
//   }
// };

// export const normalUser = (req, res, next) => {
//   if (req.user && req.user.role === "User") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as normal user" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware for role-based access
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: `Not authorized as ${req.user.role}` });
    }
  };
};
