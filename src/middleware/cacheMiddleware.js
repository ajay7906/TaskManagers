const redis = require("../config/redis");

function cacheMiddleware(prefix = "cache", ttl = Number(process.env.CACHE_TTL_SECONDS || 30)) {
  return async (req, res, next) => {
    try {
      // Only cache GET requests
      if (req.method !== "GET") return next();

      const key = `${prefix}:${req.originalUrl}`;
      const cached = await redis.get(key);
      if (cached) {
        res.setHeader("X-Cache", "HIT");
        return res.json(JSON.parse(cached));
      }

      // override res.json to cache response
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          await redis.setex(key, ttl, JSON.stringify(body));
        } catch (e) {
          console.error("Redis setex error:", e);
        }
        res.setHeader("X-Cache", "MISS");
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
}

module.exports = cacheMiddleware;
