const User = require('../models/user');

const getUser = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  /* напишите код здесь */
  User.create({name, about, avatar})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: err.message }));
}

// const deleteUser = (req, res) => {
//   User.findByIdAndRemove(req.params.id)
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: err.message }));
// }


module.exports = {
  getUser,
  // getUserById,
  createUser,
  // updateUser,
  // updateAvatar,
  // login,
  // getCurrentUser,
};