const prisma = require("../models/index.js").db;

module.exports.addUser = async (req, res) => {
  const userData = req.body;
  userData.online_status = false;
  userData.profile_pic = '';
  console.log(userData);



  try {
    await prisma.user.create({data: userData});
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