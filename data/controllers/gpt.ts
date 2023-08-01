import prisma from "../models/database.js";
import { Configuration, OpenAIApi } from "openai";


async function getAiChatHistoryByAiChatId(aiChatId) {
  const aiChatHistories = await prisma.aiChatHistory.findMany({
    where: {
      ai_chat_id: aiChatId,
    },
  });
  return aiChatHistories;
}

async function sortAiChatHistory(aiChatId) {
  try {
    const aiChatHistories = await getAiChatHistoryByAiChatId(aiChatId);

    // Sort the AIChatHistory array in chronological order based on 'created_at'
    aiChatHistories.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());

    // Format the data into the desired array of objects
    const formattedData = aiChatHistories.map((chatHistory) => {
      return {
        role: chatHistory.is_ai ? 'assistant' : 'user',
        content: chatHistory.message,
      };
    });

    return formattedData;
  } catch (error) {
    console.error('Error fetching AIChatHistory:', error);
    throw error;
  }
}

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
}


async function addAiResponseToAiChatHistory(aiChatId, message) {
  try {
    const aiChatHistory = await prisma.aiChatHistory.create({
      data: {
        ai_chat: {
          connect: {
            id: aiChatId,
          },
        },
        message,
        is_ai: true,
      },
    });
    return aiChatHistory;
  } catch (error) {
    console.error('Error adding AI response to AiChatHistory:', error);
    throw error;
  }
}

async function addUserMessageToAiChatHistory(aiChatId, message) {
  try {
    const aiChatHistory = await prisma.aiChatHistory.create({
      data: {
        ai_chat: {
          connect: {
            id: aiChatId,
          },
        },
        message,
        is_ai: false,
      },
    });
    return aiChatHistory;
  } catch (error) {
    console.error('Error adding user message to AiChatHistory:', error);
    throw error;
  }
}

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  try {
  const { info } = req.body;
  let [chatHistory, userdata] = await Promise.all([getAiChatHistoryByAiChatId(info.chatId), getUserById(info.userId), addUserMessageToAiChatHistory(info.chatId, info.message)]);
  let chatHistory = await sortAiChatHistory(chatHistory);
  let sysprompt = `You are a health and fitness coach chatbot who replies enthusiastically and encouragingly to your client. Who is ${userdata.sex}. Their age is ${userdata.age}. They have ${userdata.experience} experience with fitness. They have ${userdata.equitment} gym equipment available to them. Their weight is ${userdata.weight} pounds. They are ${userdata.height} inches tall. They have the goal to ${userdata.goal}.`

  let system = {
    role: "system",
    content: sysprompt,
  }

  let prompt = chatHistory.unshift(system);

  const gptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
    max_tokens: 256,
    temperature: 0.9,
    top_p: 1,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
    n: 1,
    stream: false,
  });

  await addAiResponseToAiChatHistory(info.chatId, gptResponse.data.choices[0].content);

  res.status(200).json(gptResponse.data.choices[0].content);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      res.sendsStatus(500);
    } else {
    console.log(error);
    res.sendsStatus(500);
  }
}
}