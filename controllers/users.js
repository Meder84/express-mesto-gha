const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ErrorConflict = require('../errors/ErrorConflict');
// const BadRequestError = require('../errors/BadRequest');
// const ValidationError = require('../errors/ValidationError');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');
// const validateCredentials = require('../middlewares/validateCredentials');
const { SALT_ROUNDS, JWT_SECRET } = require('../config/index');

const createUser = (req, res, next) => { // create всегда возвращает пароль
  // чтобы пароль не возвращал надо указать select = false;
  const {
    name, about, avatar, email, password,
  } = req.body;

  // if (!email || !password) {
  //   return next(new ValidationError('Не правильный логин или пароль!'));
  // }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже зарегистрирован`);
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch(next); // catch((err) => { next(err) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => { // аутентификация успешна!
      // создадим токен Методу sign мы передадим 3 аргумента:
      // пейлоуд токена, секретный ключ подписи и время хранения токена:
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }, // токен будет просрочен через 7дней после создания
      );
      // res.send({ jwt: token })// вернём токен
      res.cookie('jwt', token, { // вариант защищеным токеном. token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true, // проверяет домен запроса сходится ли с доменом сайта.
      })
        .send({ message: 'Авторизация прошла успешно!' });
      // .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch(next);
};

const getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
      } else if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getUsersMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((currentUser) => res.send({ currentUser }))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  getUsersMe,
};