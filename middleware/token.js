const token = null;
const tokenExpirTime = null;

async function getToken(clientId, clientSecret) {
  try {
    const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'POST' })
  } catch (err) {

  }
  const newToken = response.access_token;
  const expirationTime = Number(response.expires_in);

  //current time plus expr time = token expir time in unix epoch seconds
  tokenExpirTime = (Math.floor(Date.now() / 1000)) + expirationTime;

  if (!newToken) {
    throw new Error("Error! token not found on resposne");
  }

  return newToken;
}

async function tokenValidator(req, res, next) {

  // igdb uses seconds, as will be done here
  const currentTime = Math.floor(Date.now() / 1000);

  if (token && (currentTime < tokenExpirTime)) {
    req.token = token;
    next();
  }

  token = await getToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
  req.token = token;
  next();
}

module.exports = { tokenValidator };
