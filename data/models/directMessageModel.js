const prisma = require("./database");

const getDirectMessages = async (currentUserId, otherUserId) => {
  try {
    const messages = await prisma.directMessage.findMany({
      where: {
        AND: [
          { sender_id: currentUserId, recipient_id: otherUserId },
          { sender_id: otherUserId, recipient_id: currentUserId },
        ],
      },
      orderBy: { created_at: "desc" },
    });
    console.log("MODEL SUCCESSFULLY FOUND MESSAGES");
    return messages;
  } catch (err) {
    console.error("ERROR FINDING MESSAGES:::::", err);
    throw err;
  }
};

const saveMessage = async (currentUserId, otherUserId, chat) => {
  try {
    const newMessage = await prisma.directMessage.create({
      data: {
        sender_id: currentUserId,
        recipient_id: otherUserId,
        chat: chat,
      },
    });
    console.log("MODEL SUCCESSFULLY SAVED MESSAGE");
    return newMessage;
  } catch (err) {
    console.error("ERROR SAVING MESSAGE:::::", err);
    throw err;
  }
};

module.exports = { getDirectMessages, saveMessage };