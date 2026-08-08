const gamesRouter = require("express").Router();

async function fetchGameData(token, body) {
  try {
    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      body: body,
    });

    if (!response.ok) {
      throw new Error(`IGDB returned ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

gamesRouter.get("/featured", async (req, res, next) => {
  try {
    const featuredData = await fetchGameData(
      req.token,
      "fields id,name,rating,cover.*, url; where rating > 75 & first_release_date > 1777222981; sort rating desc;"
    );

    return res.status(200).json(featuredData);
  } catch (err) {
    return next(err);
  }
});

module.exports = { gamesRouter };
