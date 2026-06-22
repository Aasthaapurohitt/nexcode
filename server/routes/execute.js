const router = require('express').Router();
const auth = require('../middleware/auth');
const axios = require('axios');

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.50.0' },
};

router.post('/', auth, async (req, res) => {
  try {
    const { code, language, stdin } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });

    const langConfig = LANGUAGE_MAP[language] || LANGUAGE_MAP.javascript;

    const response = await axios.post(PISTON_API, {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ content: code }],
      stdin: stdin || '',
    }, { timeout: 15000 });

    const { run } = response.data;
    res.json({
      stdout: run.stdout || '',
      stderr: run.stderr || '',
      exitCode: run.code,
      signal: run.signal
    });
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      res.status(408).json({ error: 'Execution timed out' });
    } else {
      res.status(500).json({ error: err.response?.data?.message || err.message });
    }
  }
});

module.exports = router;
