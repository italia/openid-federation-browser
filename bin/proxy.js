const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

app.get("/proxy", (req, res) => {
  if (
    !req.query.url ||
    !req.query.url.startsWith("https://") ||
    req.query.url.includes("localhost") ||
    req.query.url.match(/(\d{1,3}\.){3}\d{1,3}/)
  ) {
    res.send("Please provide a valid url").status(400);
    return;
  }

  axios
    .get(req.query.url)
    .then((response) => res.send(response.data))
    .catch((error) => res.send(error));
});

app.listen(port, () => console.log(`Proxy listening on port ${port}`));
