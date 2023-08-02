const models = require('../models');
const prisma = models.db;

module.exports.addUser = async (req, res) => {
  // let userData = req.body;
  // try {
  //   await prisma.user.create({data: userData});
  //   res.sendStatus(201);
  // } catch {
  //   res.sendStatus(500);
  // }
  const user = req.body;
  user.online_status = false;
  user.profile_pic = '';
  console.log(user);

}

module.exports.getUsers = async (req, res) => {
  try {
    let users = await prisma.user.findMany();
    res.send(users);
  } catch {
    res.sendStatus(500);
  }
}