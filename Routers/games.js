const gamesRouter = require("express").Router();

const { fetchGameData } = require("../utils/fetch");

gamesRouter.get("/featured", async (req, res, next) => {
  // 100 days in seconds subtracted from todays date.

  const hundredDays = 100 * 24 * 60 * 60;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeWindow = currentTime - hundredDays;
  console.log("timeWindow", timeWindow);
  try {
    const featuredData = await fetchGameData(
      req.token,
      `fields id,name,rating,cover.*,url; where rating > 75 & first_release_date > ${timeWindow}; sort rating desc;`,
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
      `fields name,rating,cover.*,url; limit 20; sort rating desc;`,
    );
    return res.status(200).json(greatestData);
  } catch (err) {
    return next(err);
  }
});

// search with query parameters
// Do not push until input validation
// gamesRouter.get("/search", async (req, res, next) => {
//   const { query } = req.query;
//   try {
//     const searchQuery = await fetchGameData(
//       req.token,
//       `search "${query}"; fields name,release_dates.human;`,
//     );
//     return res.status(200).json(searchQuery);
//   } catch (err) {
//     return next(err);
//   }
// });
//

module.exports = { gamesRouter };
