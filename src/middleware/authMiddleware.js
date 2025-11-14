// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.authenticate = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
// //   console.log( 'Token data', req.headers)
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(payload.id);
//     if (!user) return res.status(401).json({ message: "User not found" });

//     req.user = { id: user._id, roles: user.roles };
//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };





const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redis = require("../config/redis");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    // Check blacklist
    const isBlack = await redis.get(`bl:access:${token}`);
    if (isBlack) return res.status(401).json({ message: "Token revoked" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id, roles: user.roles };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
