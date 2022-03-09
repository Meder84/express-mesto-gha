const router = require('express').Router();
const {getUser, createUser, deleteUser} = require('../controllers/users');
// const User = require('../models/user');

router.get('/', getUser);

router.post('/', createUser);

// router.delete('/:id', deleteUser);

module.exports = router;
