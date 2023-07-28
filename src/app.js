const express = require("express");
const router = require("./router");

const app = express();
const appPort = 8080;

app.set("port", appPort);

router(app);

module.exports = app;