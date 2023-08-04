const prisma = require("../models/index.js").db
const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const router = express.Router();

async function getAiChatHistoryByAiChatId(aiChatId) {
  const aiChatHistories = await prisma.aiChatHistory.findMany({
    where: {
      ai_chat_id: aiChatId,
    },
  });
  return aiChatHistories;
}

async function sortAiChatHistory(aiChatHistories) {
  try {

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
    console.error('Error sorting AIChatHistory:', error);
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

module.exports = () => {

  router.patch('/:chatId', async (req, res) => {

  try {
  const info = req.body;
  chatId = parseInt(req.params.chatId);
  let [chatHistory, userdata] = await Promise.all([getAiChatHistoryByAiChatId(chatId), getUserById(parseInt(info.userId)), addUserMessageToAiChatHistory(chatId, info.message)]);
  chatHistory = await sortAiChatHistory(chatHistory);
  let experience
  switch (userdata.experience) {
    case "0" || 0: experience = "novice";
     break;
    case "1" || 1: experience = "intermediate";
     break;
    case "2" || 2: experience = "advanced";
     break;
    case "3" || 3: experience = "expert";
     break;
  }

  let sysprompt = `You are a health and fitness coach chatbot who replies enthusiastically and encouragingly to your client. Who is ${userdata.sex}. Their age is ${userdata.age}. They have ${experience} experience with fitness. They have ${userdata.equipment ? "yes" : "no"} gym equipment available to them. Their weight is ${userdata.weight} pounds. They are ${userdata.height} inches tall. They have the goal to ${userdata.goals}.`
  let system = {
    role: "system",
    content: sysprompt,
  }

  chatHistory.unshift(system);
  const gptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: chatHistory,
    max_tokens: 256,
    temperature: 0.9,
    top_p: 1,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
    n: 1,
    stream: false,
  });
  console.log(gptResponse.data.choices[0].message.content)
  await addAiResponseToAiChatHistory(chatId, gptResponse.data.choices[0].message.content);

  res.status(200).json(gptResponse.data.choices[0].message.content);
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      res.sendStatus(500);
    } else {
    console.log(error);
    res.sendStatus(500);
  }
}
});

router.get('/:chatId', async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const chatHistory = await getAiChatHistoryByAiChatId(chatId);
    const sortedChatHistory = await sortAiChatHistory(chatHistory);
    res.status(200).json(sortedChatHistory);
  } catch (error) {
    console.error('Error fetching AIChatHistory:', error);
    res.sendStatus(500);
  }
}
)

router.post('/', async (req, res) => {
  try {
    const newChat = await prisma.aiChat.create({
      data: {
        user: {
          connect: {
            id: req.data.userId,
          },
        },
      },
    });
    res.status(200).json(newChat.id);
  } catch (error) {
    console.error('Error creating new AIChat:', error);
    res.sendStatus(500);
  }
}
)

router.delete('/:chatId', async (req, res) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const deletedChat = await prisma.aiChat.delete({
      where: {
        id: chatId,
      },
    });
    res.status(200).json(deletedChat);
  } catch (error) {
    console.error('Error deleting AIChat:', error);
    res.sendStatus(500);
  }
}
)

router.get('/user/:userId', async (req, res) => {
  try {
    const aiChats = await prisma.aiChat.findMany({
      where: {
        user_id: req.params.userId,
      },
    });
    res.status(200).json(aiChats);
  } catch (error) {
    console.error('Error fetching AIChats:', error);
    res.sendStatus(500);
  }
}
)

return router
};
