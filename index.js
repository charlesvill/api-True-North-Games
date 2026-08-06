const express = require("express");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res, next) =>
  res.status(200).send("coming live from the test route!"),
);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
