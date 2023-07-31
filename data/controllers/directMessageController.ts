import {
  saveDirectMessage,
  getDirectMessages,
} from "../models/directMessageModel";

export const fetchDirectMessages = async (currentUserId, otherUserId) => {
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
    res.status(500).send("Error getting DMs.");
  }
};
