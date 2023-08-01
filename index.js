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


// ***----- DIRECT MESSAGE ROUTES -----***
app.get("/DirectMessage", async (req, res) => {
  const { currentUserId, otherUserId } = req.params;

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

app.post("/DirectMessage", async (req, res) => {
  const { currentUserId, otherUserId, chat } = req.body;

  try {
    const sentMessage = await sendMessage (
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

app.use("/", (req, res) => {
  res.sendStatus(404);
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
