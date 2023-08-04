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

  app.post(`/${endpoint}`, async (req, res) => {
    const { currentUserId, otherUserId, chat } = req.body;

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

// Create message routes for different types (social, planner, tracker)
createMessageRoutes("social");
createMessageRoutes("planner");
createMessageRoutes("tracker");

app.use("/", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
