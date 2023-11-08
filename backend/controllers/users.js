require('dotenv').config();

const { ValidationError, CastError } = require('mongoose').Error;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const statusCodes = require('../utils/constants').HTTP_STATUS;
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const tokenJwt = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

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
    .then((user) => res.status(statusCodes.OK).send(user))
    .catch((error) => {
      if (error instanceof CastError) {
        return next(new BadRequestError('Передан невалидный id'));
      }
      return next(error);
    });
};

function updateUser(req, res, newData, next) {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, newData, { new: true, runValidators: true })
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(statusCodes.CREATED).send(user))
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
    .then((users) => res.status(statusCodes.OK).send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('NotFound'))
    .then((user) => res.status(statusCodes.OK).send(user))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, tokenJwt, {
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
