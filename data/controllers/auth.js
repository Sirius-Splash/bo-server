const prisma = require("../models/index.js").db;
const bcrypt = require('bcrypt');

module.exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({'message': 'Username and password are required.'});

  const foundUser = await prisma.user.findFirst({
    where : {username: username},
  });

  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {

  } else {
    res.sendStatus(401);
  }

};