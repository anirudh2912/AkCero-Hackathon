const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { processQuery } = require('./agents/router');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
const conversations = new Map();
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    socket.emit('conversation-history', conversations.get(conversationId));
  });

  socket.on('send-message', async (data) => {
    const { conversationId, message, timestamp } = data;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: timestamp || new Date().toISOString()
    };
    
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    conversations.get(conversationId).push(userMessage);
    
    io.to(conversationId).emit('message', userMessage);
    
    try {
      const response = await processQuery(message);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.content,
        agent: response.agent,
        timestamp: new Date().toISOString()
      };
      
      conversations.get(conversationId).push(botMessage);
      
      io.to(conversationId).emit('message', botMessage);
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        agent: 'system',
        timestamp: new Date().toISOString()
      };
      
      conversations.get(conversationId).push(errorMessage);
      io.to(conversationId).emit('message', errorMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Multi-Agent Chatbot API is running' });
});

app.get('/api/conversation/:id', (req, res) => {
  const conversationId = req.params.id;
  const conversation = conversations.get(conversationId) || [];
  res.json(conversation);
});

app.post('/api/message', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await processQuery(message);
    res.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
