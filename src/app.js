const express = require("express");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const morgan = require("morgan");
const { join } = require("path");
const router = require("./router");
const { mongoConnect, URI } = require("./utils/mongoose");
const appConfig = require("./utils/app-config");

const app = express();
const appPort = 8080;

app.set("port", appPort);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 24 * 60 * 60, // 24 horas de vida para la sesion
    }),
    secret: appConfig.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

router(app);

mongoConnect();

module.exports = app;
