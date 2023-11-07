const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const statusCodes = require('../utils/constants').HTTP_STATUS;
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ForbiddenError = require('../errors/Forbidden');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(statusCodes.CREATED).send({ data: card }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)

    .orFail(new NotFoundError('NotFound'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError(
            'Вы не являетесь обладателем карточки, поэтому не можете ее удалить',
          ),
        );
      }
      return Card.deleteOne(card).then(() => res.status(statusCodes.OK).send({ data: card }));
    })
    .catch((error) => {
      if (error instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(error);
    });
};

function changeLikeCardStatus(req, res, likeStatus, next) {
  Card.findByIdAndUpdate(req.params.cardId, likeStatus, { new: true })
    .orFail(new NotFoundError('NotFound'))
    .then((card) => res.status(statusCodes.OK).send({ data: card }))
    .catch((error) => {
      if (error instanceof CastError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки/снятия лайка',
          ),
        );
      }
      return next(error);
    });
}

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(statusCodes.OK).send({ data: cards }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const likeStatus = { $addToSet: { likes: req.user._id } };
  changeLikeCardStatus(req, res, likeStatus, next);
};

module.exports.dislikeCard = (req, res, next) => {
  const likeStatus = { $pull: { likes: req.user._id } };
  changeLikeCardStatus(req, res, likeStatus, next);
};
