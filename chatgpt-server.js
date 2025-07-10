import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/ask', async (req, res) => {
  const prompt = req.body.prompt || req.body.message;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.MODEL || 'gpt-4',
      temperature: 0.7,
    });

    const reply = chatCompletion.choices[0]?.message?.content?.trim();
    res.json({ reply: reply || '(no response)' });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'OpenAI API request failed' });
  }
});

// ✅ FIXED: Listen on all interfaces, not just localhost
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Ava ChatGPT server running on port ${port}`);
});
