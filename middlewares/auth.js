const jwt = require('jsonwebtoken');
const Forbidden = require('../errors/Forbidden');
const { JWT_SECRET } = require('../config/index');

const handleAuthError = () => {
  throw new Forbidden('Необходима авторизация');
};

module.exports = (req, res, next) => { // тут будет вся авторизация
  const { authorization } = req.headers; // достаём авторизационный заголовок
  // const token = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что он есть или начинается с Bearer
    return handleAuthError(res);
  }
  // Если токен на месте, извлечём его. Для этого вызовем  таким образом,
  // в переменную token запишется только JWT.
  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); // верифицируем токен
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
