# MARC - Multi-Agent Research Chatbot

An advanced research chatbot that combines Wikipedia knowledge with cutting-edge academic papers from arXiv to provide comprehensive, well-sourced answers to research questions.

## Features

- **Enhanced Research Capabilities**: 5-step research process combining multiple sources
- **Unified MARC Interface**: Single intelligent research assistant
- **Wikipedia Integration**: Background overviews and established knowledge
- **arXiv Research Papers**: Latest academic findings from the last 6 years
- **Smart Keyword Extraction**: Automated topic analysis and relevant paper discovery
- **Real-time Communication**: WebSocket-based chat interface with Socket.io
- **Modern Glassmorphic UI**: Beautiful, responsive design with gradients and blur effects
- **Professional Formatting**: Clean, structured responses without clutter

## Research Process Architecture

```
User Query → Topic Extraction → 5-Step Research Process → Comprehensive Response
```

### 5-Step Research Workflow:
1. **Wikipedia Overview**: Gather background information and context
2. **Keyword Extraction**: Identify 3-5 key terms from Wikipedia summary
3. **arXiv Search**: Find relevant research papers from the last 6 years
4. **Relevance Filtering**: Score and select most relevant papers (>40% relevance threshold)
5. **Response Synthesis**: Combine Wikipedia knowledge with research findings

### Query Types Supported:
- **Definition queries**: "What is...", "Define...", "Explain..."
- **Research questions**: "Tell me about...", "Summarize..."
- **How-to requests**: "How to...", "How do..."
- **Historical context**: Questions containing "history" or "historical"
- **General research**: Any topic requiring comprehensive information

## Tech Stack

### Backend
- **Node.js** with Express server
- **Socket.io** for real-time WebSocket communication
- **node-fetch** for API integrations
- **Wikipedia REST API** for background knowledge
- **arXiv API** for academic research papers
- **Custom research algorithms** for relevance scoring and filtering

### Frontend
- **React** with modern hooks (useState, useEffect, useRef)
- **Socket.io-client** for real-time chat
- **Modern CSS3** with glassmorphic design
- **Gradient backgrounds** and backdrop filters
- **Responsive design** optimized for all devices

### APIs Integrated
- **Wikipedia REST API v1**: `https://en.wikipedia.org/api/rest_v1/page/summary/`
- **arXiv API**: `http://export.arxiv.org/api/query` with XML parsing
- **Real-time Search**: Date filtering for papers from last 6 years

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Internet connection (for Wikipedia and arXiv API access)

### Backend Setup

1. Navigate to the project root directory:
```bash
cd "/Users/canirudh/Desktop/Hackathon copy JS"
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3001`

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
cd "/Users/canirudh/Desktop/Hackathon copy JS"
npm start
```

**Terminal 2 (Frontend):**
```bash
cd "/Users/canirudh/Desktop/Hackathon copy JS/client"
npm start
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Type any research question or topic
3. MARC will automatically perform the 5-step research process
4. Receive comprehensive responses combining Wikipedia knowledge with latest research

### Example Queries

**Research Topics:**
- "What is quantum computing?"
- "Explain machine learning algorithms"
- "Tell me about climate change research"
- "Define artificial intelligence"

**Scientific Inquiries:**
- "Latest developments in neural networks"
- "Recent advances in renewable energy"
- "Current research on cancer treatment"
- "Space exploration technologies"

**How-to Queries:**
- "How to implement deep learning"
- "How do solar panels work"
- "How to conduct scientific research"

**Historical Context:**
- "History of computer science"
- "Evolution of medical technology"
- "Development of the internet"

### Response Structure

Each MARC response includes:
1. **📖 Background Overview**: Wikipedia summary for context
2. **🔬 Recent Research Findings**: Relevant arXiv papers from last 6 years
3. **📊 Research Synthesis**: Analysis of current research trends
4. **💡 Key Insights**: Combined perspectives from multiple sources

## Project Structure

```
Hackathon copy JS/
├── server.js                 # Main Express server with Socket.io
├── package.json              # Backend dependencies
├── agents/                   # Research agent modules
│   ├── router.js            # Query processing and routing
│   └── researchAgent.js     # Enhanced research agent with 5-step process
├── client/                   # React frontend
│   ├── src/
│   │   ├── App.js           # Main MARC chat interface
│   │   ├── App.css          # Modern glassmorphic styling
│   │   └── index.js         # React entry point
│   ├── public/
│   │   ├── index.html       # HTML template
│   │   ├── favicon.ico      # Browser icon
│   │   ├── manifest.json    # PWA configuration
│   │   └── robots.txt       # SEO configuration
│   └── package.json         # Frontend dependencies
└── README.md                # This documentation
```

### Key Files Explained

- **server.js**: Express server with Socket.io for real-time communication
- **agents/researchAgent.js**: Core research logic with Wikipedia + arXiv integration
- **agents/router.js**: Simple query processing wrapper
- **client/src/App.js**: React component with MARC interface and chat functionality
- **client/src/App.css**: Modern CSS with gradients, glassmorphism, and responsive design

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

### Modifying Research Parameters

**Relevance Threshold**: Edit the relevance score threshold in `researchAgent.js`:
```javascript
if (hasExactPhrase || (hasRelevantContent && topicRelevanceScore > 0.05) || topicRelevanceScore > 0.3)
```

**Time Range**: Change the paper search timeframe:
```javascript
sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6); // Change 6 to desired years
```

**Paper Limit**: Adjust maximum papers per search:
```javascript
const url = `http://export.arxiv.org/api/query?search_query=${searchQuery}&start=0&max_results=20`; // Change 20
```

### Adding New Query Types

1. Add new conditions in `researchAgent.js` `process()` function
2. Create corresponding handler functions
3. Implement custom response formatting

### UI Customization

**Colors**: Modify gradient schemes in `App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
```

**Glassmorphism**: Adjust blur effects and transparency:
```css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.95);
```

## Development

### Backend Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm start    # React development server with hot reload
```

## Research Capabilities

### Current Features
- **Wikipedia Integration**: REST API v1 for reliable background information
- **arXiv Paper Search**: XML API with advanced query construction
- **Smart Filtering**: Relevance scoring based on keyword matching and phrase detection
- **Date Filtering**: Automatic filtering for papers from last 6 years
- **Multi-source Synthesis**: Combines established knowledge with cutting-edge research

### Search Strategy
- **Title Searches**: Exact phrase matching in paper titles
- **Abstract Searches**: Content matching in paper abstracts
- **Keyword Expansion**: Automatic extraction of related terms
- **Relevance Scoring**: Mathematical scoring for paper relevance (0-1 scale)
- **Quality Control**: Minimum length and content validation

## Future Enhancements

- **Additional Academic Sources**: Integration with PubMed, IEEE Xplore, ACM Digital Library
- **Citation Analysis**: Paper impact scoring based on citation counts
- **Topic Clustering**: Group related papers by research themes
- **Conversation Memory**: Remember context across multiple queries
- **Export Functionality**: Save research results as PDF or citations
- **Advanced Filtering**: Subject area, publication type, author filtering
- **Multi-language Support**: Non-English paper discovery and translation

## License

MIT License - feel free to use this project for learning and development purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Technical Details

### Dependencies

**Backend:**
- `express`: Web server framework
- `cors`: Cross-origin resource sharing
- `body-parser`: Request parsing middleware
- `socket.io`: Real-time WebSocket communication
- `node-fetch`: HTTP client for API calls

**Frontend:**
- `react`: UI framework
- `socket.io-client`: WebSocket client
- `react-scripts`: Build tooling

### Performance Considerations
- **Async Processing**: Non-blocking API calls with proper error handling
- **Relevance Filtering**: Efficient scoring algorithm to reduce irrelevant results
- **Response Caching**: Conversation history stored in memory
- **Real-time Updates**: Socket.io for immediate response delivery

### Error Handling
- **API Failures**: Graceful fallbacks when Wikipedia or arXiv are unavailable
- **Network Issues**: Retry logic and timeout handling
- **Invalid Queries**: Clear error messages for malformed requests
- **Empty Results**: Informative responses when no papers are found

## Support

For questions or issues:
1. Check the console output for debugging information
2. Verify internet connection for API access
3. Ensure both servers are running on correct ports
4. Create an issue in the repository with detailed error descriptions
