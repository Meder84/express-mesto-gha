const router = require('express').Router();
const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', likeCard); // — поставить лайк карточке

router.delete('/cards/:cardId/likes', dislikeCard); // — убрать лайк с карточки

module.exports = router;
