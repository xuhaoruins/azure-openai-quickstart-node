import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  //apiKey: process.env.OPENAI_API_KEY,  
  basePath: "https://{YOUR-PROJECT}.openai.azure.com/openai/deployments/{YOUR-DEPLOYMENT}",
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  /*
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }
*/
  const chatMsg = req.body.chatMsg || '';

  if (chatMsg.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid chatMsg",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: chatMsg,
      temperature: 0.7,
      max_tokens: 1000,

    },{
      headers: {
        'api-key': process.env.OPENAI_API_KEY,
      },
      params: { "api-version": "2022-12-01" }
    },
    );

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
/*
function generatePrompt(chatMsg) {
  const capitalizedchatMsg =
    chatMsg[0].toUpperCase() + chatMsg.slice(1).toLowerCase();
  return `Suggest three names for an chatMsg that is a superhero.

chatMsg: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
chatMsg: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
chatMsg: ${capitalizedchatMsg}
Names:`;
}
*/
