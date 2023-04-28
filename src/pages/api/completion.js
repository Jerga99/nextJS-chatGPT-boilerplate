

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY
});

const openAi = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const prompt = req.body.prompt || "";

    if (!process.env.OPENAI_SECRET_KEY) {
      return res.status(500).json({error: {message: "Api key is not provided!"}});
    }

    if (prompt.trim().length === 0) {
      return res.status(400).json({error: {message: "Provide prompt value!"}});
    }

    try {
      const completion = await openAi.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(prompt),
        temperature: 0.7,
        max_tokens: 1024
      });

      return res.status(200).json({result: completion.data.choices[0].text});
    } catch (e) {
      return res.status(400).json({error: {message: e.message}});
    }

  } else {
    return res.status(500).json({error: {message: "Invalid Api Route!"}});
  }
}


function generatePrompt(prompt) {
  const message = `Your name is Henry and you are very friendly and knowledgeable AI.
  Your main field of knowledge is programmin and computer sciences.
  Human: ${prompt}
  Henry: 
  `;

  return message;
}
