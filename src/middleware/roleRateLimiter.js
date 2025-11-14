const redis = require("../config/redis");

const WINDOW_SECONDS = Number(process.env.ROLE_LIMIT_WINDOW_SECONDS || 60);
const LIMITS = {
  user: Number(process.env.ROLE_RATE_LIMIT_USER || 60),
  manager: Number(process.env.ROLE_RATE_LIMIT_MANAGER || 200),
  admin: Number(process.env.ROLE_RATE_LIMIT_ADMIN || 1000)
};

function getLimitForRoles(roles = []) {
  if (roles.includes("admin")) return LIMITS.admin;
  if (roles.includes("manager")) return LIMITS.manager;
  return LIMITS.user;
}

async function roleRateLimiter(req, res, next) {
  try {
    // If no user (public route), fallback to global IP limiter (already present).
    if (!req.user || !req.user.id) return next();

    const uid = req.user.id.toString();
    const limit = getLimitForRoles(req.user.roles || []);
    const key = `rl:user:${uid}:window:${Math.floor(Date.now() / 1000 / WINDOW_SECONDS)}`;

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - current));

    if (current > limit) {
      return res.status(429).json({ message: "Too many requests (role-based rate limit)" });
    }

    next();
  } catch (err) {
    console.error("Role rate limiter error:", err);
    next();
  }
}

module.exports = roleRateLimiter;
