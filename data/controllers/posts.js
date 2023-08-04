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

module.exports.postComment = async (req, res) => {
  console.log(req.body)
  if (!req.body.body || !req.body.user_id || !req.body.post_id) {
    res.sendStatus(400);
    return;
  }
  await prisma.comment.create({data: req.body}).then((response) => {
    res.sendStatus(201);
  }).catch((err) => {
    res.sendStatus(500);
    console.error(err);
  })
}

module.exports.getComments = async (req, res) => {
  if (!req.query.id) {
    res.sendStatus(400);
    return;
  }
  req.query.id = parseInt(req.query.id);
  req.query.skip = parseInt(req.query.skip);
  req.query.take = parseInt(req.query.take);
  await prisma.comment.findMany({
    where: {
      post_id: req.query.id
    },
    orderBy: [
      {
        created_at: 'desc'
      }
    ],
    skip: req.query.skip || 0,
    take: req.query.take || 5,
    include: {
      user: {
        select: {
          username: true,
          profile_pic: true,
        }
      }
    }
  }).then((response) => {
    res.send(response);
  }).catch((err) => {
    res.sendStatus(500);
    console.error(err);
  })
}

module.exports.postPost = async (req, res) => {
  let photos = req.body.photos;
  req.body.user_id = 3;
  delete req.body.photos;
  console.log(req.body)
  await prisma.post.create({data: req.body})
  .then((response)=>{
    res.status(201)
    res.send()
  })
  .catch((err)=>{
    res.sendStatus(500);
    console.log('Post not accepted')
    console.log(err.message)
  })
}