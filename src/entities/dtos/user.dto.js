class UsersDto {
  constructor(username, email, password, firstName, lastName, cart, role) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.cart = cart;
    this.role = role;
  }
}

module.exports = UsersDto;