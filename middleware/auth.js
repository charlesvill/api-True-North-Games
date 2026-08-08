function authCheckpoint(req, res, next) {
  const secret = process.env.PROXY_SECRET;

  const apiKey = req.get("X-API-Key");

  console.log(typeof apiKey, apiKey);
  console.log(typeof secret, secret);
  if (apiKey !== secret) {
    return res.status(401).json({ error: "Not Authorized!" });
  }

  next();
}

module.exports = { authCheckpoint };
