class UsersDto {
  constructor(
    username,
    email,
    password,
    firstName,
    lastName,
    cart,
    documents,
    role,
    lastConnection
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.cart = cart;
    this.documents = documents;
    this.role = role;
    this.lastConnection = lastConnection;
  }
}

module.exports = UsersDto;
