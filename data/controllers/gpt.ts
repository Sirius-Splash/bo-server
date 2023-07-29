import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  const { info } = req.body;
  const userdata = info.userdata;
  let sysprompt = `You are a health and fitness coach chatbot who replies enthusiastically and encouragingly to your client. Who is ${userdata.sex}. Their age is ${userdata.age}. They have ${userdata.experience} experience with fitness. They have ${userdata.equitment} gym equipment available to them. Their weight is ${userdata.weight} pounds. They are ${userdata.height} inches tall. They have the goal to ${userdata.goal}.`

  let system = {
    role: "system",
    content: sysprompt,
  }

  let prompt = info.messages.unshift(system);
  //

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

  res.status(200).json({ gptResponse });
};