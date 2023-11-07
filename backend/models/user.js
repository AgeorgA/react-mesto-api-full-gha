const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { default: isEmail } = require('validator/lib/isEmail');
const { default: isURL } = require('validator/lib/isURL');
const UnauthorisedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },

    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },

    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => isURL(v),
        message: 'Ошибка при вводе ссылки',
      },
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле email является обязательным'],
      validate: {
        validator: (v) => isEmail(v),
        message: 'Ошибка при вводе почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Введите, пожалуйста, пароль'],
      select: false,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      const error = 'Неправильные почта или пароль';
      if (!user) {
        return Promise.reject(new UnauthorisedError(error));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorisedError(error));
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);
