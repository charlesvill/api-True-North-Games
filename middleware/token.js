const token = require("../utils/tokenCache.js");

async function getToken() {
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();

  console.log("New token generation response: ", data);
  const newToken = data.access_token;
  const expiresIn = Number(data.expires_in);

  //current time plus expr time = token expir time in unix epoch seconds
  const expirTime = Math.floor(Date.now() / 1000) + expiresIn;

  if (!newToken) {
    throw new Error(
      `Error! token not found on response: ${JSON.stringify(data)}`,
    );
  }
  return { newToken, expirTime };
}

async function tokenValidator(req, res, next) {
  // igdb uses seconds, as will be done here
  const currentTime = Math.floor(Date.now() / 1000);

  try {
    if (token.get() && currentTime < token.expireTime()) {
      req.token = token.get();
      return next();
    }

    const { newToken, expirTime } = await getToken();
    token.set(newToken);
    token.setExpire(expirTime);
    req.token = token.get();
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { tokenValidator };
