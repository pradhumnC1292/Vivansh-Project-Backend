import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role, lastActivity: Date.now() },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
