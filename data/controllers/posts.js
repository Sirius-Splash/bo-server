const models = require('../models');
const prisma = models.db;

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