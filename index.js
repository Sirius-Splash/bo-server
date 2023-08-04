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

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const controllers = require("./data/controllers");
const { fetchDirectMessages, sendMessage } = require("./data/controllers/directMessageController");

app.use(morgan("dev"));
app.use(bodyParser.json());

app.post("/user", controllers.addUser);
app.get('/users', controllers.getUsers);

// Define a function for creating message routes
function createMessageRoutes(endpoint) {
  app.get(`/${endpoint}`, async (req, res) => {
    const { currentUserId, otherUserId } = req.query;

    try {
      const fetchedDirectMessages = await fetchDirectMessages(
        currentUserId,
        otherUserId
      );
      console.log("SUCCESSFULLY GOT DMS:::::", fetchedDirectMessages);
      res.json(fetchedDirectMessages);
    } catch (err) {
      console.log("ERROR GETTING DMS:::::", err);
      res.status(500).send(err.message || "Error getting DMs.");
    }
  });

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(bodyParser.json())
  app.post(`/${endpoint}`, async (req, res) => {
    const { currentUserId, otherUserId, chat } = req.body;

app.use("/gpt", gpt());
app.get('/posts', postControllers.getPosts);
app.get('/user', usersControllers.getUser);
app.get('/comments', postControllers.getComments);
    try {
      const sentMessage = await sendMessage(
        currentUserId,
        otherUserId,
        chat
      );
      console.log("SUCCESSFULLY SENT DM:::::", sentMessage);
      res.json(sentMessage);
    } catch (err) {
      console.log("ERROR SENDING DM:::::", err);
      res.status(500).send(err.message || "Error sending DM.");
    }
  });
}

app.post('/user', usersControllers.addUser);
app.post('/posts', postControllers.postPost);
app.post('/comments', postControllers.postComment);
app.get('/tracker', trackerControllers.getWorkouts);
app.post('/tracker', trackerControllers.postWorkout)
// Create message routes for different types (social, planner, tracker)
createMessageRoutes("social");
createMessageRoutes("planner");
createMessageRoutes("tracker");

app.use("/", (req, res) => {
  res.sendStatus(404);
});


app.listen(PORT)
console.log(`Listening on port ${PORT}`)

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
