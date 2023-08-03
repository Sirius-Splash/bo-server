const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const bodyParser = require('body-parser')
const gpt = require('./data/controllers/gpt.js')
const app = express()
const PORT = 8080
const usersControllers = require('./data/controllers/users')
const postControllers = require('./data/controllers/posts')
const trackerControllers = require('./data/controllers/tracker')


app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use("/gpt", gpt());

app.get('/posts', postControllers.getPosts);
app.get('/user', usersControllers.getUser);
app.get('/comments', postControllers.getComments);

app.post('/user', usersControllers.addUser);
app.post('/posts', postControllers.postPost);
app.post('/comments', postControllers.postComment);
app.get('/tracker', trackerControllers.getWorkouts);
app.post('/tracker', trackerControllers.postWorkout)

app.use('/', (req, res)=>{
  res.sendStatus(404)
});


app.listen(PORT)
console.log(`Listening on port ${PORT}`)
