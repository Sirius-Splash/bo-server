const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const bodyParser = require('body-parser')
const gpt = require('./data/controllers/gpt.js')
const app = express()
const PORT = 8080
const usersControllers = require('./data/controllers/users');
const postControllers = require('./data/controllers/posts');
const authControllers = require('./data/controllers/auth');
const trackerControllers = require('./data/controllers/tracker')
const dmControllers = require("./data/controllers/directMessages");

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5173/signup',
];
const corsOptions = {
  origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },

  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/auth', authControllers.loginUser);
app.post('/register', usersControllers.registerUser);



//PROTECTED ROUTES
app.use(verifyJWT);

app.use("/gpt", gpt());

app.get('/posts', postControllers.getPosts);
app.get('/comments', postControllers.getComments);

app.post('/posts', postControllers.postPost);
app.post('/comments', postControllers.postComment);
app.get('/tracker', trackerControllers.getWorkouts);
app.post('/tracker', trackerControllers.postWorkout)

app.get('/social', dmControllers.fetchDirectMessages);
app.get('/tracker', dmControllers.fetchDirectMessages);
app.get('/planner', dmControllers.fetchDirectMessages);
app.post('/social', dmControllers.sendMessage);
app.post('/tracker', dmControllers.sendMessage);
app.post('/planner', dmControllers.sendMessage);

app.use("/", (req, res) => {
  res.sendStatus(404);
});


app.listen(PORT)
console.log(`Listening on port ${PORT}`)