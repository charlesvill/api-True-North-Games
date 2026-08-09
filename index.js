const express = require("express");

const PORT = process.env.PORT || 3000;

const { authCheckpoint } = require("./middleware/auth.js");
const { tokenValidator } = require("./middleware/token.js");
const { gamesRouter } = require("./Routers/games.js");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use("/games", authCheckpoint, tokenValidator, gamesRouter);

app.get("/test", (req, res, next) =>
  res.status(200).send("coming live from the test route!"),
);

app.use((req, res, next) => {
  return next(new Error(`404: Not Found! path: ${req.path}`));
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .send(err.name + " " + err.statusCode + ": " + err.message);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
