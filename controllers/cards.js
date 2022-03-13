const Card = require('../models/card');
const { ERROR_CODE, ERROR_SERVER, NOT_FOUND } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(NOT_FOUND).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_CODE).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => res.status(ERROR_SERVER).send({ message: err.message }));
};