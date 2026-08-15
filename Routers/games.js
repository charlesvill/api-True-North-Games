const gamesRouter = require("express").Router();

const { fetchGameData } = require("../utils/fetch");

const currentTime = Math.floor(Date.now() / 1000);

gamesRouter.get("/featured", async (req, res, next) => {
  // 100 days in seconds subtracted from todays date.

  const hundredDays = 100 * 24 * 60 * 60;
  const timeWindow = currentTime - hundredDays;
  console.log("timeWindow", timeWindow);
  try {
    const featuredData = await fetchGameData(
      req.token,
      `fields id,name,slug,rating,cover.*,screenshots.*,artworks.*,url, first_release_date; where rating > 75 & first_release_date > ${timeWindow}; sort total_rating_count desc;`,
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
      `search "${search}"; fields id,name,slug,rating,cover.*,first_release_date,url; where rating > 75 & first_release_date > ${timeWindow}; sort rating desc;`,
    );
    return res.status(200).json(searchQuery);
  } catch (err) {
    return next(err);
  }
});

module.exports = { gamesRouter };
