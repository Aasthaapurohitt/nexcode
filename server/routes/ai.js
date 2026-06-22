const router = require('express').Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are an expert AI coding assistant integrated into a code editor (similar to GitHub Copilot or Cursor). 
You help developers write better code, explain complex concepts, fix bugs, and optimize their code.
Be concise, accurate, and always provide working code examples when relevant.
When responding to code-related requests, format code blocks with the appropriate language tag.`;

async function callGemini(messages, maxTokens = 1500) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  // Drop any leading assistant/model messages — Gemini history must start with 'user'
  let cleaned = [...messages];
  while (cleaned.length > 0 && cleaned[0].role === 'assistant') {
    cleaned.shift();
  }
  if (cleaned.length === 0) {
    cleaned = [messages[messages.length - 1]];
  }

  const history = cleaned.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  const lastMessage = cleaned[cleaned.length - 1];

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: maxTokens }
  });

  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

router.post('/explain', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const reply = await callGemini([{
      role: 'user',
      content: `Explain this ${language || 'code'} clearly and concisely. Describe what it does, how it works, and any important concepts:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``
    }]);

    res.json({ result: reply });
  } catch (err) {
    console.error('AI explain error:', err.message);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/debug', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const reply = await callGemini([{
      role: 'user',
      content: `Analyze this ${language || 'code'} for bugs, errors, and potential issues. List each problem found, explain why it's a problem, and provide the corrected code:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``
    }]);

    res.json({ result: reply });
  } catch (err) {
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/optimize', auth, async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const reply = await callGemini([{
      role: 'user',
      content: `Optimize this ${language || 'code'} for performance, readability, and best practices. Show the improved version with explanations of what was changed and why:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``
    }]);

    res.json({ result: reply });
  } catch (err) {
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, language } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    const reply = await callGemini([{
      role: 'user',
      content: `Write ${language || 'code'} that does the following: ${prompt}\n\nProvide only the code with brief comments explaining key parts.`
    }]);

    res.json({ result: reply });
  } catch (err) {
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/complete', auth, async (req, res) => {
  try {
    const { code, language, cursorPosition } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const codeBeforeCursor = code.substring(0, cursorPosition || code.length);

    const reply = await callGemini([{
      role: 'user',
      content: `Complete the following ${language || 'code'}. Only return the code that should be inserted at the cursor position, nothing else:\n\n\`\`\`${language || ''}\n${codeBeforeCursor}\`\`\``
    }], 500);

    const codeMatch = reply.match(/```[\w]*\n?([\s\S]*?)```/);
    const completion = codeMatch ? codeMatch[1] : reply;

    res.json({ completion: completion.trim() });
  } catch (err) {
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/chat', auth, async (req, res) => {
  try {
    const { messages, code, language } = req.body;
    if (!messages || !messages.length) return res.status(400).json({ error: 'Messages required' });

    const formattedMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    if (code && formattedMessages.length > 0) {
      const lastMsg = formattedMessages[formattedMessages.length - 1];
      if (lastMsg.role === 'user') {
        lastMsg.content = `[Current code in editor (${language || 'unknown'}):\n\`\`\`${language || ''}\n${code}\n\`\`\`]\n\n${lastMsg.content}`;
      }
    }

    const reply = await callGemini(formattedMessages, 2000);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

module.exports = router;
