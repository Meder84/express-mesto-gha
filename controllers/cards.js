const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

// Здравствуйте Роман. Спасибо вам большое за то, что вы подсказываете как исправить
// этих ошибок, но у меня остается последняя итерация в связи с этим, к вам
// большая просьба. Не могли бы оставить, вместе с ошибками еще и примеры. Спасибо большое!

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
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
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequestError('Невозможно удалить!');
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные!' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
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
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Произошла ошибка!' });

        return;

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
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND).send({ message: 'Произошла ошибка!' });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};