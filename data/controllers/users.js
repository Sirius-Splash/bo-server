const prisma = require("../models/index.js").db;
const bcrypt = require('bcrypt')

module.exports.addUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({'message': 'Username and password are required.'});

  const duplicate = await prisma.user.findFirst({
    where : {username: username},
  });
  console.log('DUPED:', duplicate);
  if (username) return res.sendStatus(409);

  const userData = req.body;
  userData.online_status = false;
  userData.profile_pic = '';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;
    console.log('AFTER HASH: ', userData)


    // await prisma.user.create({data: userData});
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports.getUser = async (req, res) => {
  // try {
  //   let users = await prisma.user.findMany();
  //   res.send(users);
  // } catch {
  //   res.sendStatus(500);
  // }

  console.log('HEARD');
  console.log(req.query);
}