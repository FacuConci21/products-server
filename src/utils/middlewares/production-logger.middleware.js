const winston = require("winston");
const { join } = require("path");
const { levels } = require("../constants/logger-options");

const logger = winston.createLogger({
  levels: levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      level: "error",
      filename: "./errors.log",
      dirname: join(process.cwd(), "src", "public", "logs"),
    }),
  ],
});

const appLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.error(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = appLogger;
