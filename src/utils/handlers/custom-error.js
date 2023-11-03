class CustomError {
  static create({ name = "Error", message, code = 1, cause }) {
    const error = new Error(message);
    error.name = name;
    error.cause = cause;
    error.code = code;
    throw error;
  }
}

const ErrorCodes = {
  RESOURSE_ALREADY_EXISTS: 1,
  INVALID_CREDENTIALS: 2,
  REQUIRED_FIELD_MISSING: 3,
  EMPTY_FIELD: 4,
  STOCK_NOT_AVAILABLE: 5,
  RESOURSE_NOT_AVAILABLE: 6,
  INVALID_ROLE: 7,
};

const ErrorMsgs = {
  RESOURSE_ALREADY_EXISTS: "Este recurso ya existe",
  INVALID_CREDENTIALS: "Las credenciales son invalidas",
  REQUIRED_FIELD_MISSING: "Falta un campo requerido",
  EMPTY_FIELD: "Campo vacio",
  STOCK_NOT_AVAILABLE: "No hay suficiente stock",
  RESOURSE_NOT_AVAILABLE: "No se encontro el recurso",
  INVALID_ROLE: "Rol de usuario invalid",
};

const ErrorTypes = {
  CREATE_USER_VALIDATION: "create_user_validation",
  LOGIN_USER_VALIDATION: "login_user_validation",
  UNEXPECTED_EXCEPTION: "unexpected_exception",
  CREATE_PRODUCT_VALIDATION: "create_product_validation",
  CREATE_CART_VALIDATION: "create_cart_validation",
  UPDATE_CART_VALIDATION: "update_cart_validation",
};

module.exports = { CustomError, ErrorCodes, ErrorMsgs, ErrorTypes };
