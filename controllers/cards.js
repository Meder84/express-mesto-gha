const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate(['creator'])
    .then(cards => res.send({ data: cards }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { title, text, creatorId } = req.body;

  Card.create({ title, text, creator: creatorId })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: err.message }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  // likeCard,
  // dislikeCard,
};
