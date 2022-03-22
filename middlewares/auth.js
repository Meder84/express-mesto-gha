const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const handleAuthError = () => {
  throw new Unauthorized('Необходима авторизация');
};

module.exports = (req, res, next) => { // тут будет вся авторизация
  const { authorization } = req.headers; // достаём авторизационный заголовок
  const token = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) { // убеждаемся, что он есть или начинается с Bearer
    return handleAuthError(res);
  }
  // Если токен на месте, извлечём его. Для этого вызовем  ким образом,
  // в переменную token запишется только JWT.

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key'); // верифицируем токен
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};