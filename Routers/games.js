const gamesRouter = require("express").Router();

const { fetchGameData } = require("../utils/fetch");

const hundredDays = 100 * 24 * 60 * 60;
const currentTime = Math.floor(Date.now() / 1000);
const timeWindow = currentTime - hundredDays;

gamesRouter.get("/featured", async (req, res, next) => {
  // 100 days in seconds subtracted from todays date.

  console.log("timeWindow", timeWindow);
  try {
    const featuredData = await fetchGameData(
      req.token,
      `fields id,name,slug,rating,cover.*,screenshots.*,artworks.*,url,first_release_date; where rating > 75 & first_release_date > ${timeWindow}; sort total_rating_count desc;`,
    );

    return res.status(200).json(featuredData);
  } catch (err) {
    return next(err);
  }
});

gamesRouter.get("/goat", async (req, res, next) => {
  // will pull the best games of all time
  try {
    const greatestData = await fetchGameData(
      req.token,
      `fields id,name,rating,cover.*,screenshots.*,artworks.*,url; limit 20; sort rating_count desc;`,
    );
    return res.status(200).json(greatestData);
  } catch (err) {
    return next(err);
  }
});

gamesRouter.get("/search", async (req, res, next) => {
  const { query } = req.query;
  if (typeof query !== "string") {
    return res.status(400).send("Invalid search!");
  }

  let search = query.trim();
  if (search.length < 2 || search.length > 50) {
    return res.status(400).send("Invalid search!");
  }

  try {
    const searchQuery = await fetchGameData(
      req.token,
      `search "${search}"; fields id,name,slug,cover.*,rating,first_release_date; limit 8; where game_type = 0 & first_release_date != null & version_parent = null & rating != null;`,
    );
    return res.status(200).json(searchQuery);
  } catch (err) {
    return next(err);
  }
});

gamesRouter.get("/:gameId", async (req, res, next) => {
  const { gameId } = req.params;

  if (!/^\d+$/.test(gameId)) {
    return next();
  }
  try {
    const searchQuery = await fetchGameData(
      req.token,
      `fields id,name,slug,rating,genres.*,age_ratings.*,game_type.*,dlcs.*,game_engines.*,involved_companies.*,platforms.*,similar_games.*,storyline,summary,tags.*,themes.*,websites.*,cover.*,screenshots.*,artworks.*,first_release_date; where id = ${gameId};`,
    );
    return res.status(200).json(searchQuery);
  } catch (err) {
    return next(err);
  }
});

module.exports = { gamesRouter };
