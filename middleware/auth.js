function authCheckpoint(req, res, next) {
  const secret = process.env.PROXY_SECRET;

  const apiKey = req.get("X-API-Key");

  if (apiKey !== secret) {
    res.status(401).json({ error: "Not Authorized!" });
  }

  next();
}

module.exports = { authCheckpoint };
