const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: (v) => isEmail(v),
    //   message: 'Неправильный формат почты',
    // },
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
  return this.findOne({ email }).select('+password') // this — это модель User // +password чтобы пароль тоже вернуло.
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        // пользователь не найден — отклоняем промис с ошибкой и переходим в блок catch
        return Promise.reject(new Unauthorized('Неправильный логин или пароль'));
      }
      // нашёлся — сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            return Promise.reject(new Unauthorized('Неправильный логин или пароль'));
          }
          // аутентификация успешна
          // res.send({ message: 'Всё верно!' });
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
