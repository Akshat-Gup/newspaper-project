const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Route to handle file upload and article generation
app.post('/generate-article', upload.single('userFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { style } = req.body;
    
    // Read the uploaded file
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Generate article using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional newspaper journalist writing in ${style} style. Create a compelling, well-structured newspaper article based on the information provided. Include a catchy headline, subheading, and organized paragraphs. Make it engaging and newsworthy.`
        },
        {
          role: "user",
          content: `Write a newspaper article about this person based on the following information:\n\n${fileContent}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    const article = completion.choices[0].message.content;

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ article });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate article: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
