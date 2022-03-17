const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
    })
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequestError('Невозможно удалить!');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
    } else if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректный id!' });
    } else {
      res.status(SERVER_ERROR).send({ message: err.message });
    }
  });
};