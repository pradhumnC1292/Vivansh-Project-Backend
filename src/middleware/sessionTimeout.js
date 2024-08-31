import jwt from "jsonwebtoken";

export const sessionTimeout = (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return next();
  }

  const token = req.cookies.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const now = Date.now();
    const lastActivity = decoded.lastActivity || now;

    // Set the timeout for inactivity 30 min
    const timeout = 30 * 60 * 1000;

    if (now - lastActivity > timeout) {
      res.cookie("token", "", { maxAge: 0, httpOnly: true });
      return res
        .status(401)
        .json({ message: "Session expired due to inactivity" });
    }

    // Update last activity timestamp
    decoded.lastActivity = now;

    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role, lastActivity: now },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, Token is invalid" });
  }
};
