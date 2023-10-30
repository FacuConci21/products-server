const winston = require("winston");
const { levels } = require("../constants/logger-options");

const logger = winston.createLogger({
  levels: levels,
  transports: [
    new winston.transports.Console({ level: "debug" }),
  ],
});

const appLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.debug(
    `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = appLogger;
