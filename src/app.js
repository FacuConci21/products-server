const express = require("express");
const handlebars = require("express-handlebars");
const morgan = require("morgan");
const { join } = require("path");
const router = require("./router");

const app = express();
const appPort = 8080;

app.set("port", appPort);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

router(app);

module.exports = app;
