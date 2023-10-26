class CustomError {
  static create({ name = "Error", message, code = 1, cause }) {
    const error = new Error(message);
    error.name = name;
    error.cause = cause;
    error.code = code;
    throw error;
  }
}

module.exports = CustomError;