const prisma = require("../models/index.js").db;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.loginUser = async (req, res) => {
  console.log("Hello")
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({'message': 'Username and password are required.'});

  const foundUser = await prisma.user.findFirst({
    where : {username: username},
  });

  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {

    const accessToken = jwt.sign(
      {username: foundUser.username},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: 60*10}
    );
    const refreshToken = jwt.sign(
      {username: foundUser.username},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: 60*60*24}
    );


    const updateToken = await prisma.user.update({
      where: {
        id: foundUser.id
      },
      data: {
        access: refreshToken
      }
    });


    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000});
    res.send({ accessToken });
  } else {
    res.sendStatus(401);
  }

};