const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(BAD_REQUEST).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(NOT_FOUND).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(NOT_FOUND).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequest('Произошла ошибка!');
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(BAD_REQUEST).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequest('Произошла ошибка!');
      }
      res.send({ data: user });
    })
    .catch((err) => res.status(BAD_REQUEST).send({ message: err.message }));
};