const winston = require("winston");
const { join } = require("path");
const appConfig = require("../configs/app.config");

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  debug: 3,
  info: 4,
  http: 5,
};

const transports = () => {
  switch (appConfig.env) {
    case "development":
      return [
        new winston.transports.Console({
          level: "info",
        }),
      ];
    case "production":
      return [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({
          level: "error",
          filename: "./errors.log",
          dirname: join(process.cwd(), "src", "public", "logs"),
        }),
      ];
    default:
      break;
  }
};

const logger = winston.createLogger({
  levels,
  transports: transports(),
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
});

const appLogger = (req, res, next) => {
  req.logger = logger;
  logger.info(`${req.method} ${req.url}`);
  next();
};

module.exports = { appLogger, logger };
