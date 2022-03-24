const ValidationError = require('../errors/ValidationError');

const validateCredentials = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Не правильный логин или пароль!'));
  }
  return next(); // Если next не вызовем тогда приложение завистнить.
};

module.exports = validateCredentials;
