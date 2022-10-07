const jwt = require('jsonwebtoken');
const UNAUTHORIZED_CODE = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(UNAUTHORIZED_CODE)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;// записываем пейлоуд в объект запроса

  next();// пропускаем запрос дальше
};
