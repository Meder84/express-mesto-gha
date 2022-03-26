// eslint-disable-next-line import/newline-after-import
// const { isCelebrateError } = require('celebrate');
// const errorHandler = (err, req, res, next) => {
//   console.log(err.stack || err);
//   const status = err.statusCode || 500;

//   if (isCelebrateError(err)) {
//     const [error] = err.details.values();
//     return res.status(400).send({ message: error.message });
//   }
//   res.status(status).send({
//     message: err.message,
//   });
//   return next();
// };
const errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  return next();
};

module.exports = errorHandler;
