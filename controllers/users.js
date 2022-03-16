const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');


module.exports.createUser = (req, res) => {

  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError' ) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
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
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });

        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
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
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });

        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};