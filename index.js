require("dotenv").config();

const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

const { authCheckpoint } = require("./middleware/auth.js");
const { tokenValidator } = require("./middleware/token.js");
const { gamesRouter } = require("./Routers/games.js");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  }),
);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/games", authCheckpoint, tokenValidator, gamesRouter);

app.get("/test", (req, res, next) =>
  res.status(200).send("coming live from the test route!"),
);

app.use((req, res, next) => {
  return next(
    new Error(
      `404: Not Found! path: ${req.path} | method: ${req.method} | url: ${req.originalUrl}`,
    ),
  );
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
