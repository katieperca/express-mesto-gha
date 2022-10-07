const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BAD_REQUEST_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const NOT_FOUND_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.finfindUserByCredentialsdOne(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      // if(!user) {
      //   return Promise.reject(new Error('Неправильные почта или пароль'));
      // }
      res.status(200).send(token);
    })
    .catch((err) => res.status(UNAUTHORIZED_CODE).send({ message: err.message }));
};


module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Передан некорректный _id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      { name, about, avatar, email, password: hash },
    ))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: err.message });
    });
};
