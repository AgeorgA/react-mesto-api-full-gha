const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const statusCodes = require('../utils/constants').HTTP_STATUS;
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(statusCodes.CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }
      if (error.code === 11000) {
        return next(new ConflictError('Учетная запись уже существует'));
      }
      return next(error);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(statusCodes.OK).send({ data: user }))
    .catch((error) => {
      if (error instanceof CastError) {
        return next(new BadRequestError('Передан не валидный id'));
      }
      return next(error);
    });
};

function updateUser(req, res, newData, next) {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, newData, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.status(statusCodes.CREATED).send({ data: user }))
    .catch((error) => {
      if (error instanceof CastError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      return next(error);
    });
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(statusCodes.OK).send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(statusCodes.OK).send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'secret-value', {
          expiresIn: '7d',
        }),
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  updateUser(req, res, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUser(req, res, { avatar });
};
