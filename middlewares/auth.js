const jwt = require('jsonwebtoken');
const Forbidden = require('../errors/Forbidden');
const { JWT_SECRET } = require('../config/index');

const handleAuthError = () => {
  throw new Forbidden('Необходима авторизация');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
