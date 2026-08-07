const gamesRouter = require("express").Router();

gamesRouter.post("/featured", (req, res, next) => {
  // define routes for querying
});

gamesRouter.get("/goat", (req, res, next) => {});


gamesRouter.get("/search", (req, res, next) => {
  // expects  /games/search?query=fallout

  const { query } = req.query;

});

module.exports = { gamesRouter };
