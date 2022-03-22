const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена!' });
});

app.use(errorHandler);
app.listen(PORT);
// 58-min;