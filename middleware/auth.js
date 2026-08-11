function authCheckpoint(req, res, next) {
  const secret = process.env.PROXY_SECRET;

  const apiKey = req.get("X-API-Key");

  // console.log(typeof apiKey, apiKey);
  // console.log(typeof secret, secret);

  if (apiKey !== secret) {
    const error = new Error("Not Authorized to Access Proxy!");
    error.status = 401;
    next(error);
  }
  next();
}

module.exports = { authCheckpoint };
