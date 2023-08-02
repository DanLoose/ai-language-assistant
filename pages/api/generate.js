const axios = require('axios');

export default async function (req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter your english text",
      }
    });
    return;
  }

  const messages = generatePrompt(text);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.2,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // The response may have multiple completions; we'll select the first one.
    const completion = response.data.choices[0].message;
    const assistantReply = completion.role === 'assistant' ? completion.content : null;

    res.status(200).json({ result: assistantReply });
  } catch (error) {
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

function generatePrompt(text) {
  return [
    { role: 'system', content: 'You will be provided with statements, and your task is to traslate it and convert them to standard English.' },
    { role: 'user', content: 'She no went to the market.' },
    { role: 'assistant', content: 'She did not go to the market.' },
    { role: 'user', content: text },
  ];
}
