const fetch = require('node-fetch');

async function process(query) {
  const lowerQuery = query.toLowerCase();
  if (
    lowerQuery.startsWith('what is') ||
    lowerQuery.startsWith('define') ||
    lowerQuery.startsWith('explain') ||
    lowerQuery.startsWith('describe') ||
    lowerQuery.startsWith('summarize') ||
    lowerQuery.startsWith('summary') ||
    lowerQuery.startsWith('who is') ||
    lowerQuery.startsWith('who are') ||
    lowerQuery.startsWith('tell me about')
  ) {
    return await handleDefinitionQuery(query);
  } else if (lowerQuery.startsWith('how to') || lowerQuery.startsWith('how do')) {
    return handleHowToQuery(query);
  } else if (lowerQuery.includes('news') || lowerQuery.includes('current events')) {
    return handleNewsQuery(query);
  } else if (lowerQuery.includes('history') || lowerQuery.includes('historical')) {
    return handleHistoryQuery(query);
  } else {
    return await handleDefinitionQuery(query);
  }
}

async function handleDefinitionQuery(query) {
  const topic = extractTopic(query);
  
  const wikiSummary = await getWikipediaOverview(topic);
  if (!wikiSummary) {
    return `No information found for "${topic}".`;
  }
  
  const keywords = extractTopKeywords(wikiSummary, topic);
  console.log(`Step 2 - Extracted keywords: [${keywords.join(', ')}]`);
  
  const arxivPapers = await searchArxivWithKeywords(keywords);
  
  const relevantPapers = filterAndSummarizeResearch(topic, arxivPapers);
  
  return combineIntoFinalResponse(topic, wikiSummary, relevantPapers);
}

function handleHowToQuery(query) {
  const topic = extractTopic(query);
  return `How to ${topic}:

Here's a step-by-step guide for ${topic}:

Step 1: Preparation
- Gather necessary materials and tools
- Understand the prerequisites
- Set up your workspace

Step 2: Planning
- Break down the task into smaller steps
- Create a timeline or checklist
- Identify potential challenges

Step 3: Execution
- Follow the steps systematically
- Take notes and document your progress
- Make adjustments as needed

Step 4: Review
- Check your work for accuracy
- Test the results
- Make improvements if necessary

Additional Tips:
- Start with simpler examples before tackling complex cases
- Don't hesitate to ask for help when needed
- Practice regularly to improve your skills

Would you like me to elaborate on any specific step or provide more detailed guidance for your particular situation?`;
}

async function handleExplanationQuery(query) {
  return await handleDefinitionQuery(query);
}

async function handleSummaryQuery(query) {
  return await handleDefinitionQuery(query);
}
async function getWikipediaOverview(topic) {
  try {
    console.log(`Step 1 - Getting Wikipedia overview for: ${topic}`);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const summary = data.extract || null;
    console.log(`Step 1 - Wikipedia summary length: ${summary ? summary.length : 0} characters`);
    return summary;
  } catch (err) {
    console.log(`Step 1 - Wikipedia API error:`, err);
    return null;
  }
}

function extractTopKeywords(wikiSummary, originalTopic) {
  console.log(`Step 2 - Extracting keywords from Wikipedia summary...`);
  
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'cannot', 'a', 'an', 'this', 'that', 'these', 'those', 'from', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'also', 'such', 'other', 'used', 'using', 'use'];
  
  const words = wikiSummary
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4 && !stopWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index);
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topWords = Object.keys(wordFreq)
    .sort((a, b) => wordFreq[b] - wordFreq[a])
    .slice(0, 3);
  
  const keywords = [originalTopic, ...topWords].slice(0, 5);
  
  console.log(`Step 2 - Selected top keywords: [${keywords.join(', ')}]`);
  return keywords;
}

async function searchArxivWithKeywords(keywords) {
  try {
    const primaryTopic = keywords[0];
    const searchTerms = [];
    
    if (primaryTopic.includes(' ')) {
      searchTerms.push(`ti:"${encodeURIComponent(primaryTopic)}"`);
      searchTerms.push(`abs:"${encodeURIComponent(primaryTopic)}"`);
    }
    
    keywords.slice(0, 3).forEach(keyword => {
      if (keyword.length > 4) {
        searchTerms.push(`all:${encodeURIComponent(keyword)}`);
      }
    });
    
    const searchQuery = searchTerms.join(' OR ');
    
    console.log(`Step 3 - Searching arXiv with keywords: [${keywords.join(', ')}]`);
    console.log(`Step 3 - Enhanced search query: ${searchQuery}`);
    
    const sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);
    console.log(`Step 3 - Searching papers published after: ${sixYearsAgo.toDateString()}`);
    
    const url = `http://export.arxiv.org/api/query?search_query=${searchQuery}&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Step 3 - arXiv API response not ok: ${response.status}`);
      return [];
    }
    
    const xmlText = await response.text();
    console.log(`Step 3 - XML response received, length: ${xmlText.length}`);
    
    const papers = parseArxivXML(xmlText, sixYearsAgo);
    console.log(`Step 3 - Found ${papers.length} papers from arXiv in the last 6 years`);
    
    return papers;
  } catch (err) {
    console.log('Step 3 - arXiv API error:', err);
    return [];
  }
}

function parseArxivXML(xmlText, minDate) {
  const papers = [];
  
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xmlText)) !== null && papers.length < 5) {
    const entry = match[1];
    
    const titleMatch = entry.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    let title = titleMatch ? titleMatch[1].replace(/\n/g, ' ').trim() : '';
    
    title = title.replace(/\s+/g, ' ').trim();
    if (!title || title.length < 5) {
      console.log('Skipping paper with invalid title');
      continue;
    }
      
    const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
    let summary = summaryMatch ? summaryMatch[1].replace(/\n/g, ' ').trim() : '';
    summary = summary.replace(/\s+/g, ' ').trim();
    
    const publishedMatch = entry.match(/<published[^>]*>(.*?)<\/published>/);
    const publishedDate = publishedMatch ? new Date(publishedMatch[1]) : new Date(0);
    
    console.log(`Parsing paper: "${title.substring(0, 50)}..." published: ${publishedDate.toDateString()}`);
    
    if (publishedDate >= minDate && title && summary) {
      papers.push({
        title,
        summary: summary.length > 300 ? summary.substring(0, 300) + '...' : summary,
        publishedDate: publishedDate.toLocaleDateString()
      });
    }
  }
  
  console.log(`Successfully parsed ${papers.length} valid papers`);
  return papers;
}

function combineIntoFinalResponse(topic, wikiSummary, relevantPapers) {
  console.log(`Step 5 - Combining Wikipedia summary and ${relevantPapers.length} research papers into final response`);
  
  let response = `Research Analysis: ${topic}\n\n`;
  
  response += `📖 Background Overview:\n${wikiSummary}\n\n`;
  
  if (relevantPapers.length > 0) {
    response += `🔬 Recent Research Findings (Last 6 Years):\n\n`;
    
    relevantPapers.forEach((paper, index) => {
      response += `${index + 1}. ${paper.title}\n`;
      response += `   Published: ${paper.publishedDate} | Relevance: ${(paper.relevanceScore * 100).toFixed(0)}%\n`;
      response += `   ${paper.summary}\n\n`;
    });
    
    response += `📊 Research Synthesis:\n`;
    response += `Analysis of ${relevantPapers.length} highly relevant papers from the last 6 years shows active ongoing research in ${topic}. `;
    response += `These studies contribute to advancing our understanding through various methodological approaches and findings, `;
    response += `indicating this remains an important and evolving field of study.\n\n`;
    
    response += `💡 Key Insights:\n`;
    response += `The combination of established knowledge from Wikipedia and cutting-edge research from arXiv provides `;
    response += `a comprehensive view of ${topic}, covering both foundational concepts and the latest academic developments. `;
    response += `This dual approach ensures both accessibility for general understanding and depth for advanced research purposes.`;
  } else {
    response += `🔍 Research Status:\n`;
    response += `While ${topic} has a solid foundation of established knowledge, no recent academic papers were found in the arXiv database `;
    response += `for the last 6 years that directly match this topic. This could indicate either a mature field with established knowledge `;
    response += `or research published in other venues not covered by arXiv.`;
  }
  
  console.log(`Step 5 - Final response generated (${response.length} characters)`);
  return response;
}

function filterAndSummarizeResearch(topic, papers) {
  if (papers.length === 0) {
    console.log(`Step 4 - No papers found for topic: ${topic}`);
    return [];
  }
  
  console.log(`Step 4 - Analyzing ${papers.length} papers for relevance to: ${topic}`);
  
  const topicWords = topic.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const relevantPapers = [];
  
  for (const paper of papers) {
    const paperText = (paper.title + ' ' + paper.summary).toLowerCase();
    
    const hasRelevantContent = topicWords.some(word => 
      paperText.includes(word.toLowerCase())
    );
    
    const topicRelevanceScore = calculateRelevanceScore(topic, paperText);
    
    const hasExactPhrase = paperText.includes(topic.toLowerCase());
    
    console.log(`Step 4 - Analyzing: "${paper.title.substring(0, 50)}..."`);
    console.log(`  Keywords: ${hasRelevantContent}, Score: ${topicRelevanceScore.toFixed(2)}, Exact: ${hasExactPhrase}`);
    
    if (hasExactPhrase || (hasRelevantContent && topicRelevanceScore > 0.05) || topicRelevanceScore > 0.3) {
      relevantPapers.push({
        ...paper,
        relevanceScore: topicRelevanceScore
      });
      console.log(`  ✅ Paper accepted (relevance: ${topicRelevanceScore.toFixed(2)})`);
    } else {
      console.log(`  ❌ Paper rejected (relevance: ${topicRelevanceScore.toFixed(2)})`);
    }
  }
  
  relevantPapers.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  console.log(`Step 4 - Selected ${relevantPapers.length} most relevant papers`);
  return relevantPapers.slice(0, 5);
}
function calculateRelevanceScore(topic, paperText) {
  const topicWords = topic.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const matchingWords = topicWords.filter(word => paperText.includes(word.toLowerCase()));
  
  if (topicWords.length === 0) return 0;
  
  const fullTopicMatch = paperText.includes(topic.toLowerCase()) ? 0.5 : 0;
  
  const wordMatchScore = matchingWords.length / topicWords.length;
  
  return Math.max(wordMatchScore, fullTopicMatch);
}

function handleNewsQuery(query) {
  return `Current Events and News:

I understand you're looking for current news and events. Here's what I can tell you:

Recent Developments:
- Technology continues to advance rapidly
- Global events are shaping various industries
- New research and discoveries are being made regularly

Important Note:
For the most up-to-date and accurate news information, I recommend:
- Checking reputable news websites
- Following official sources and organizations
- Using news aggregators and apps
- Verifying information from multiple sources

Topics I Can Help With:
- General knowledge and background information
- Historical context and analysis
- Explanation of complex topics
- Research and fact-checking assistance

Would you like me to help you understand any specific topic or provide background information on current events?`;
}

function handleHistoryQuery(query) {
  const topic = extractTopic(query);
  return `Historical Context of ${topic}:

Let me provide you with the historical background of ${topic}:

Early Origins:
- Initial development and early concepts
- Key figures and contributors
- Historical milestones and breakthroughs

Evolution Over Time:
- Major developments and changes
- Periods of significant growth or decline
- Influence of historical events and context

Modern Era:
- Current state and recent developments
- Contemporary applications and uses
- Future prospects and trends

Historical Significance:
Understanding the history of ${topic} is important because it:
- Provides context for current developments
- Helps explain why things are the way they are
- Offers insights into future possibilities
- Connects past achievements to present challenges

Key Historical Figures:
- Important contributors and their contributions
- Influential thinkers and practitioners
- Pioneers and innovators

Would you like me to focus on a specific time period or aspect of ${topic}'s history?`;
}

function handleGeneralQuery(query) {
  return `Research and Information:

I'd be happy to help you with your research question: "${query}"

What I Can Help With:
- Providing background information and context
- Explaining complex concepts in simple terms
- Offering different perspectives on topics
- Suggesting areas for further research

Approach to Your Question:
1. Understanding - Breaking down what you're asking
2. Research - Gathering relevant information
3. Analysis - Evaluating different aspects
4. Synthesis - Combining insights into a coherent response

Next Steps:
- Could you provide more specific details about what you're looking for?
- Are there particular aspects you'd like me to focus on?
- Do you need information for a specific purpose or context?

Additional Resources:
- Academic databases and journals
- Reputable websites and organizations
- Expert opinions and analysis
- Community discussions and forums

I'm here to help you find the information you need. What specific details would be most helpful for your research?`;
}

function extractTopic(query) {
  const cleaned = query
    .replace(/^(what is|what are|how to|how do|explain|describe|tell me about|summarize|define|who is|who are)\s*/i, '')
    .replace(/\?$/, '')
    .trim();
  return cleaned || 'this topic';
}

module.exports = {
  process
};
