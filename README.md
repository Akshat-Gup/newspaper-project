# The Personal Chronicle 📰

Transform your personal story into a professionally crafted newspaper article with The Personal Chronicle - where you become the headline!

## Features

- **Multiple Newspaper Styles**: Choose from New York Times, Classic, Modern, or Tabloid styles
- **AI-Powered Content**: Uses OpenAI's GPT to generate compelling, newsworthy articles about you
- **Authentic Newspaper Design**: Features halftone effects, classic typography, and newspaper layouts
- **File Upload**: Simply upload a text file with your information
- **Easy Sharing**: Share your personalized article with friends and family
- **Print-Ready**: Generate print-quality newspaper pages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Akshat-Gup/newspaper-project.git
cd newspaper-project
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
```bash
cp .env.example .env
```
Then edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the Application

Start the server:
```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

1. **Prepare Your Information**: Create a text file with details about yourself - accomplishments, interests, background, or any story you want to tell.

2. **Upload Your File**: Click the "Choose File" button and select your text file.

3. **Select a Style**: Use the tabs at the top to choose your preferred newspaper style (New York Times, Classic, Modern, or Tabloid).

4. **Generate**: Click "Generate Article" and wait while the AI creates your personalized newspaper article.

5. **Share**: Use the Share button to share your article, or Print to create a physical copy.

### Example Information File

Create a file like `my-info.txt`:
```
Name: John Smith
Age: 32
Occupation: Software Engineer
Achievements: 
- Developed award-winning mobile app with 1M+ downloads
- Completed marathon in under 4 hours
- Volunteer coding instructor at local community center
Hobbies: Rock climbing, photography, and cooking
Recent News: Just launched a startup focused on sustainable technology
```

## Project Structure

```
newspaper-project/
├── public/
│   ├── index.html       # Main HTML file
│   ├── css/
│   │   └── styles.css   # Newspaper styling and themes
│   └── js/
│       └── app.js       # Frontend JavaScript
├── server.js            # Express server and OpenAI integration
├── uploads/             # Temporary file storage
├── .env.example         # Environment variables template
└── package.json         # Project dependencies
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-3.5 Turbo
- **File Handling**: Multer

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

ISC License

## Acknowledgments

- Inspired by classic newspaper design and typography
- Powered by OpenAI's GPT technology
