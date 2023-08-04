const models = require('../models');
const prisma = models.db;

modules.exports.fetchDirectMessages = async (req, res) => {
  try {
    const { currentUserId, otherUserId } = req.body;
    const messages = await prisma.directMessage.findMany({
      where: {
        AND: [
          { sender_id: currentUserId, recipient_id: otherUserId },
          { sender_id: otherUserId, recipient_id: currentUserId },
        ],
      },
      orderBy: { created_at: "desc" },
    });
    console.log("MODEL SUCCESSFULLY FOUND MESSAGES",
      messages
    );
    res.send(messages);
  } catch (err) {
    console.log("CONTROLLER ERROR GETTING DMS:::::", err);
    res.sendStatus(500);
  }
};

module.exports.sendMessage = async (req, res) => {
  try {
    const { currentUserId, otherUserId, chat } = req.body;
    const newMessage = await prisma.directMessage.create({
      data: {
        sender_id: currentUserId,
        recipient_id: otherUserId,
        chat: chat,
      },
    });
    console.log("MODEL SUCCESSFULLY SAVED MESSAGE", newMessage);
    res.sendStatus(400);
    return;
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}
