const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    // required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    // required: true,
  },
  avatar: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // пароль не возвращает.;
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        // пользователь не найден — отклоняем промис с ошибкой и переходим в блок catch
        throw new Unauthorized('Неправильные почта или пароль');
      }

      // нашёлся — сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            throw new Unauthorized('Неправильные почта или пароль');
          }
          // аутентификация успешна
          // res.send({ message: 'Всё верно!' });
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);