const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

const NOT_FOUND_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6331d563b8b8c32b9aacded0',
  };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая страница не найдена' });
});
app.post('/signin', login);
app.post('/signup', createUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
