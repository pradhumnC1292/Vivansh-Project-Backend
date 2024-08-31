import express from "express";
import csrf from "csurf";
import { check } from "express-validator";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { sessionTimeout } from "../middleware/sessionTimeout.js";

const router = express.Router();

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });

router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

router.post(
  "/register",
  csrfProtection,
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Please include a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6 or more characters"),
    check("role")
      .isIn(["User", "Manager", "Admin", "Super Admin"])
      .withMessage("Invalid role"),
  ],
  registerUser
);

router.post("/login", csrfProtection, loginUser);
router.post("/logout", protect, csrfProtection, logoutUser);

// Protected routes no CSRF required for GET requests

router.use(sessionTimeout);

router.get(
  "/superadmin",
  protect,
  authorizeRoles("Super Admin"),
  (req, res) => {
    res.send("Super Admin content");
  }
);

router.get("/admin", protect, authorizeRoles("Admin"), (req, res) => {
  res.send("Admin content");
});

router.get(
  "/manager",
  protect,
  authorizeRoles("Admin", "Manager"),
  (req, res) => {
    res.send("Manager content");
  }
);

router.get("/user", protect, authorizeRoles("User"), (req, res) => {
  res.send("User content");
});

export default router;
