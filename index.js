const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
const controllers = require("./data/controllers");
import {
  fetchDirectMessages,
  sendDirectMessage,
} from "./controllers/directMessageController";

app.use(morgan("dev"));
app.use(bodyParser.json());

app.post("/user", controllers.addUser);
// app.get('/users', controllers.getUsers);

app.use("/", (req, res) => {
  res.sendStatus(404);
});

// ***----- DIRECT MESSAGE ROUTES -----***
app.get("/direct_messages", async (req, res) => {
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
    res.status(500).send("Error getting DMs.");
  }
});

app.listen(PORT);
console.log(`Listening on port ${PORT}`);
