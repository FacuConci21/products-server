const express = require("express");
const ProductManager = require("./products/ProductManager");
const router = require("./router");

const app = express();
const appPort = 8080;
const productManager = new ProductManager("files");

app.set("port", appPort);

router(app);

module.exports = app;