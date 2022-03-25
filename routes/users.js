const router = require('express').Router();
const {
  getUser, getUserById, getUsersMe, updateUser, updateAvatar,
} = require('../controllers/users');

const {
  userValid, avatarValid, userValidId,
} = require('../middlewares/validations');

router.get('/users', getUser);
router.get('/users/me', getUsersMe);
router.get('/users/:userId', userValidId, getUserById);
router.patch('/users/me', userValid, updateUser);
router.patch('/users/me/avatar', avatarValid, updateAvatar);

module.exports = router;
