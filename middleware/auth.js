function AuthCheckpoint(req, res, next) {
  const secret = process.env.SECRET;

  const apiKey = req.get("X-API-Key");

  if (apiKey !== secret) {
    res.status(401).json({ error: "Not Authorized!" });
  }

  next(req, res, next);
}

module.exports = { AuthCheckpoint };
