const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { style } = req.body;
    
    // Read the uploaded file
    filePath = path.join(__dirname, 'uploads', req.file.filename);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');

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
    res.json({ article });

  } catch (error) {
    console.error('Error generating article:', error);
    
    // Provide user-friendly error messages without exposing sensitive details
    let userMessage = 'Failed to generate article. Please try again.';
    if (error.code === 'invalid_api_key') {
      userMessage = 'Invalid API key configuration. Please check your settings.';
    } else if (error.status === 429) {
      userMessage = 'API rate limit reached. Please try again later.';
    }
    
    res.status(500).json({ error: userMessage });
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
