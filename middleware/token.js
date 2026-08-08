let token = null;
let tokenExpirTime = null;

async function getToken(clientId, clientSecret, next) {
  try {
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

    console.log("response: ", data);
    const newToken = data.access_token;
    const expirationTime = Number(data.expires_in);

    //current time plus expr time = token expir time in unix epoch seconds
    tokenExpirTime = (Math.floor(Date.now() / 1000)) + expirationTime;

    if (!newToken) {
      throw new Error("Error! token not found on resposne");
    }

    return newToken;
  } catch (err) {
    return next(err)
  }
}

async function tokenValidator(req, res, next) {

  // igdb uses seconds, as will be done here
  const currentTime = Math.floor(Date.now() / 1000);

  if (token && (currentTime < tokenExpirTime)) {
    req.token = token;
    next();
  }

  token = await getToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET, next);
  req.token = token;
  next();
}

module.exports = { tokenValidator };
