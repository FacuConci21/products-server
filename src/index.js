const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hola mundo" });
});

app.listen(3000, () => console.log("App running."));
