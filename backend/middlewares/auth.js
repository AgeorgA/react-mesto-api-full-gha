require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const tokenJwt = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

const handleAuthError = (res, next) => {
  next(new UnauthorizedError('Необходима авторизация'));
};
const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, tokenJwt);
  } catch (err) {
    return handleAuthError(res, next);
  }
  req.user = payload;
  return next();
};
