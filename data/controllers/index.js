const models = require('../models');
const prisma = models.db;

module.exports.addUser = async (req, res) => {
  let userData = req.body;
  try {
    await prisma.user.create({data: userData});
    res.sendStatus(201);
  } catch {
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

module.exports.getPosts = async (req, res) => {
  try {
    let posts = await prisma.post.findMany({
      orderBy: [
        {
          created_at: 'desc'
        }
      ],
      take: 5,
      include: {
        photos: {
          orderBy: {
            id: 'asc'
          }
        },
        user: {
          select: {
            username: true,
            profile_pic: true
          }
        }
      }
    });
    res.send(posts);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
}