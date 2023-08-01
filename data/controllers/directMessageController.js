const { getDirectMessages, saveMessage } = require("../models/directMessageModel")

const fetchDirectMessages = async (currentUserId, otherUserId) => {
  try {
    const directMessageList = await getDirectMessages(
      currentUserId,
      otherUserId
    );
    console.log(
      "CONTROLLER SUCCESSFULLY RETRIEVED DMS:::::",
      directMessageList
    );
    return directMessageList;
  } catch (err) {
    console.log("CONTROLLER ERROR GETTING DMS:::::", err);
    throw new Error("Error getting DMs.");
  }
};

const sendMessage = async (currentUserId, otherUserId, chat) => {
  try {
    const savedMessage = await saveMessage(currentUserId, otherUserId, chat)
    console.log("CONTROLLER SUCCESSFULLY SAVED MESSAGE:::::", savedMessage);
    return savedMessage;
  } catch (err) {
    console.log("CONTROLLER ERROR SAVING DM:::::", err);
    throw new Error("Error saving DM.");
  }
}

module.exports = { fetchDirectMessages, sendMessage };
