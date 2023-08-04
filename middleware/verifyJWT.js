const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  console.log('HEADERS IN JWT', req.headers)
  console.log('COOKIE IN JWT', req.cookies)
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);


      // console.log(req.user);
      // console.log(req.username);
      // console.log(decoded.username);

      next();
    }
  )
};

module.exports = verifyJWT;