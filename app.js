const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { limiter } = require('./middlewares/rateLimit');
const { NOT_FOUND } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const { createUser, login } = require('./controllers/users');
// const validateCredentials = require('./middlewares/validateCredentials');
const validations = require('./middlewares/validations');
const auth = require('./middlewares/auth');
// const { errors } = require('celebrate');
const { PORT } = require('./config/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cookieParser());
// роуты, не требующие авторизации, например, регистрация и логин
app.post('/signup', validations.register, createUser);
app.post('/signin', login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

// midlleWare celebrate. Выводит ответа об ошибке в формате по умолчанию.
// Если хотим в кастомном формате выводил ответ, тогда в errorHandler изпользуемся
// библеотекой isCelebrateError
// app.use(errors());

// app.use(limiter);
app.use(errorHandler);
app.listen(PORT);
