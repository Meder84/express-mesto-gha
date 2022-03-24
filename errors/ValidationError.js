class ValidationError extends Error {
  constructor(message = 'Не правильные логин или пароль!') {
    super(message);
    this.statusCode = 400;
    this.name = ValidationError;
  }
}

module.exports = ValidationError;
