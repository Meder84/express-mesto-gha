const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '622e417865ef9307a649fa76', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.get('/', (req, res) => {
  res.send('hello world! after reload');
});

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.listen(PORT);