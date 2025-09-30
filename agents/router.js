const researchAgent = require('./researchAgent');

async function processQuery(query) {
  try {
    const response = await researchAgent.process(query);
    
    return {
      content: response,
      agent: 'research',
      confidence: 'high'
    };
  } catch (error) {
    console.error('Error processing query with research agent:', error);
    return {
      content: 'I\'m sorry, I encountered an error while processing your request. Please try rephrasing your question.',
      agent: 'system',
      confidence: 'low'
    };
  }
}

module.exports = {
  processQuery
};
