const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFound = require('../errors/NotFoundError');
const ErrorConflict = require('../errors/ErrorConflict');
// const BadRequestError = require('../errors/BadRequest');
const ValidationError = require('../errors/ValidationError');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

module.exports.createUser = (req, res, next) => { // create всегда возвращает пароль
  // чтобы пароль не возвращал надо указать select = false;
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Не правильный логин или пароль!'));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`Пользователь ${email} уже зарегистрирован`);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // .then((user) => {
    //   const test = User.findOne({ _id: user._id });
    //   return test;
    // })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    }); // catch(next);
};

module.exports.getUser = (req, res) => {
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

module.exports.getUserById = (req, res) => {
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

module.exports.updateUser = (req, res) => {
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

module.exports.updateAvatar = (req, res) => {
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