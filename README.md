# Multi-Agent Chatbot

A sophisticated chatbot with multiple specialized agents that automatically route user queries to the most appropriate agent based on intent classification.

## Features

- **Automatic Agent Routing**: Intelligent intent classification routes queries to the right agent
- **Four Specialized Agents**:
  - 🔍 **Research Agent**: General knowledge, fact-checking, and explanations
  - 🧮 **Math Agent**: Calculations, equations, and problem-solving
  - 💻 **Code Agent**: Programming help, debugging, and code assistance
  - 📋 **Task Agent**: Productivity tasks, conversions, and utilities
- **Real-time Communication**: WebSocket-based chat interface
- **Modern UI**: Beautiful, responsive React frontend
- **Agent Identification**: Visual indicators show which agent responded

## System Architecture

```
User Query → Intent Classifier → Specialized Agent → Response
```

The system uses keyword-based intent classification to automatically route queries:
- **Math keywords**: solve, calculate, equation, +, -, ×, ÷, etc.
- **Code keywords**: function, variable, debug, Python, JavaScript, etc.
- **Research keywords**: what, how, why, explain, information, etc.
- **Task keywords**: todo, convert, translate, schedule, etc.

## Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **Custom agent modules** for specialized responses

### Frontend
- **React** with modern hooks
- **Socket.io-client** for real-time updates
- **CSS3** with modern styling and animations
- **Responsive design** for mobile and desktop

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the project root directory:
```bash
cd /Users/canirudh/Desktop/Hackathon
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Running Both Services

You can run both services simultaneously:

**Terminal 1 (Backend):**
```bash
cd /Users/canirudh/Desktop/Hackathon
npm start
```

**Terminal 2 (Frontend):**
```bash
cd /Users/canirudh/Desktop/Hackathon/client
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Type any question or request
3. The system will automatically route your query to the appropriate agent
4. Receive specialized responses based on the agent's expertise

### Example Queries

**Math Agent:**
- "Calculate 25 + 37"
- "Solve the equation 2x + 5 = 13"
- "What's the area of a circle with radius 5?"

**Code Agent:**
- "How do I create a function in Python?"
- "Debug this JavaScript code"
- "Explain object-oriented programming"

**Research Agent:**
- "What is machine learning?"
- "Explain the history of the internet"
- "Summarize the latest AI developments"

**Task Agent:**
- "Create a todo list for my project"
- "Convert 100 USD to EUR"
- "Translate 'hello' to Spanish"

## Project Structure

```
Hackathon/
├── server.js                 # Main backend server
├── package.json              # Backend dependencies
├── agents/                   # Specialized agent modules
│   ├── router.js            # Intent classification and routing
│   ├── researchAgent.js     # Research and knowledge agent
│   ├── mathAgent.js         # Mathematical problem-solving agent
│   ├── codeAgent.js         # Programming assistance agent
│   └── taskAgent.js         # Productivity and utility agent
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.js           # Main chat component
│   │   ├── App.css          # Modern styling
│   │   └── index.js         # React entry point
│   └── package.json         # Frontend dependencies
└── README.md                # This file
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/conversation/:id` - Get conversation history
- `POST /api/message` - Send message via REST API

## WebSocket Events

- `join-conversation` - Join a conversation
- `send-message` - Send a message
- `message` - Receive a message
- `conversation-history` - Receive conversation history

## Customization

### Adding New Agents

1. Create a new agent file in the `agents/` directory
2. Implement the `process(query)` function
3. Add the agent to the router in `agents/router.js`
4. Update the frontend to display the new agent

### Modifying Intent Classification

Edit the `INTENT_KEYWORDS` object in `agents/router.js` to add or modify keywords for each agent.

### Styling

The frontend uses CSS3 with modern features. Modify `client/src/App.css` to customize the appearance.

## Development

### Backend Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm start    # React development server with hot reload
```

## Future Enhancements

- Integration with external APIs (OpenAI, Wolfram Alpha, etc.)
- Machine learning-based intent classification
- Conversation memory and context
- File upload and processing
- Voice input/output
- Multi-language support
- User authentication and profiles

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For questions or issues, please create an issue in the repository or contact the development team.
