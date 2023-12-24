const nodemailer = require("nodemailer");
const appConfig = require("./configs/app.config");
const { logger } = require("./middlewares/logger.middleware");

class MailAdapter {
  #transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: appConfig.gmail.appMail,
      pass: appConfig.gmail.appPassword,
    },
  });

  async sendMail(messageInfo) {
    try {
      const { userEmail, subjectMail, bodyMail } = messageInfo;
      await this.#transport.sendMail({
        from: appConfig.gmail.appMail,
        to: userEmail,
        subject: subjectMail,
        text: bodyMail,
      });
      logger.info(`Mail enviado a ${userEmail}`);
    } catch (error) {
      logger.error("No se pudo enviar el mail - error: " + error.message);
      throw error;
    }
  }
}

module.exports = MailAdapter;
