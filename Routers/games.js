const gamesRouter = require("express").Router();

async function fetchGameData(token, body) {
  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games",
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': 'Client ID',
          'Authorization': 'Bearer access_token',
        },
        // ex. 'fields name,rating,screenshot.*; search "Fallout"; where date < 154363454; sort date desc;'
        // note** all dates work as seconds in unix time
        body: `${body}`
      })
      .then(response => {
        console.log(response.json());
      })
      .catch(err => {
        console.error(err);
      });
    return response;
  } catch (err) {
    throw new Error(err);
  }
}

gamesRouter.post("/featured", async (req, res, next) => {
  // define routes for querying
  // generate a unix time stamp for current date minus 100 days
  // fields should search games with release date after calculated timestamp (seconds).
  //
  const featuredData = await fetchGameData(req.token, 'fields id,name,rating,cover.*, url; where rating > 75 &  first_release_date > 1777222981; sort rating desc;');

  if (featuredData) {
    res.status(200).json(featuredData);
  }
  res.status(400).send("not found!");
});


// gamesRouter.get("/goat", (req, res, next) => { });
//
//
// gamesRouter.get("/search", (req, res, next) => {
//   // expects  /games/search?query=fallout
//
//   const { query } = req.query;
//
// });

module.exports = { gamesRouter };
