const prisma = require("../models/index.js").db;

module.exports.addUser = async (req, res) => {
  const userData = req.body;
  user.online_status = false;
  user.profile_pic = '';
  console.log(user);



  try {
    await prisma.user.create({data: userData});
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports.getUsers = async (req, res) => {
  try {
    let users = await prisma.user.findMany();
    res.send(users);
  } catch {
    res.sendStatus(500);
  }
}