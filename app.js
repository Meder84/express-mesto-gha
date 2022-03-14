const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NotFound = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '622e417865ef9307a649fa76',
  };

  next();
});

app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use('*', () => {
  throw new NotFound('Запрошен несуществующий роут');
});

app.listen(PORT);