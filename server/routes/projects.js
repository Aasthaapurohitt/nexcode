const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort('-updatedAt');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, language } = req.body;
    const defaultContent = {
      javascript: '// Welcome to your new JavaScript project!\nconsole.log("Hello, World!");\n',
      python: '# Welcome to your new Python project!\nprint("Hello, World!")\n',
      typescript: '// Welcome to your new TypeScript project!\nconst greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet("World"));\n',
      java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n',
      go: 'package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
      rust: 'fn main() {\n    println!("Hello, World!");\n}\n',
    };

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      language: language || 'javascript',
      files: [{
        name: `main.${getExtension(language || 'javascript')}`,
        language: language || 'javascript',
        content: defaultContent[language] || defaultContent.javascript
      }]
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project (save code)
router.put('/:id', auth, async (req, res) => {
  try {
    const { files, language, name } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { files, language, name, updatedAt: new Date() },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getExtension(lang) {
  const map = { javascript: 'js', typescript: 'ts', python: 'py', java: 'java', cpp: 'cpp', go: 'go', rust: 'rs' };
  return map[lang] || 'txt';
}

module.exports = router;
