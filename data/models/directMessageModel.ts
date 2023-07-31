import { prisma } from "./database";

export const getDirectMessages = async (currentUserId, otherUserId) => {
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
