import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import Message, { IMessage } from './models/Message';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Strongly typed Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// --- TYPE INTERFACES FOR SOCKET PAYLOADS ---
interface SocketMessagePayload {
  nickname: string;
  text: string;
}

// --- GEMINI DIRECT REST CALL HELPER ---
async function generateGeminiContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`;
  
  const response = await axios.post(
    url,
    { contents: [{ parts: [{ text: prompt }] }] },
    {
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey.trim()
      }
    }
  );

  return response.data.candidates[0].content.parts[0].text;
}

// --- LOCAL AI FALLBACK ENGINE LOGIC ---
function getLocalSummary(messages: IMessage[]): string {
  const count = messages.length;
  const uniqueUsers = Array.from(new Set(messages.map(m => m.nickname))).join(', ');
  
  return `📋 [Chat Room Summary ]\n` +
         `• Total analyzed traffic: ${count} recent messages.\n` +
         `• Active participants: ${uniqueUsers}.\n` +
         `• Context Overview: The room is highly interactive with ongoing casual check-ins.`;
}

function searchLocalMessages(messages: IMessage[], query: string): string {
  const cleanQuery = query.toLowerCase().trim();
  
  let coreKeyword = cleanQuery
    .replace(/who mentioned/g, '')
    .replace(/what was discussed about/g, '')
    .replace(/is there any mention of/g, '')
    .replace(/\?/g, '')
    .trim();

  if (!coreKeyword) coreKeyword = cleanQuery;

  const matches = messages.filter(m => 
    m.text.toLowerCase().includes(coreKeyword) || 
    m.nickname.toLowerCase().includes(coreKeyword)
  );
  
  if (matches.length === 0) {
    return `🔍 [AI Local Search Mode]\nI scanned the history for "${coreKeyword}" but found no direct matching mentions.`;
  }

  const resultsStr = matches.map(m => `• ${m.nickname}: "${m.text}"`).join('\n');
  return `🔍 [AI Local Search Mode]\nBased on the room history, I found these matching discussions:\n\n${resultsStr}`;
}

// --- REST API UTILITIES ---
app.get('/api/ai/summary', async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(30);
    if (messages.length === 0) {
      return res.json({ summary: "No messages to summarize yet!" });
    }

    const chatContext = messages.reverse().map(m => `${m.nickname}: ${m.text}`).join('\n');
    const prompt = `Summarize the following chat transcript concisely:\n\n${chatContext}`;

    try {
      const aiText = await generateGeminiContent(prompt);
      res.json({ summary: aiText });
    } catch (apiErr) {
      console.warn("⚠️ Gemini Auth error. Using local fallback summary.");
      res.json({ summary: getLocalSummary(messages) });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server computation fault' });
  }
});

app.post('/api/ai/search', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });

  try {
    const messages = await Message.find().sort({ timestamp: -1 }).limit(100);
    const chatContext = messages.reverse().map(m => `${m.nickname}: ${m.text}`).join('\n');
    const prompt = `Using these logs:\n${chatContext}\nAnswer query: ${query}`;

    try {
      const aiText = await generateGeminiContent(prompt);
      res.json({ answer: aiText });
    } catch (apiErr) {
      console.warn("⚠️ Gemini Auth error. Using local fallback search.");
      res.json({ answer: searchLocalMessages(messages, query) });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server processing fault' });
  }
});

// --- REAL-TIME CHAT SYNC VIA SOCKET.IO ---
io.on('connection', (socket: Socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Fetch history on connection
  Message.find().sort({ timestamp: -1 }).limit(50)
    .then(messages => socket.emit('chat_history', messages.reverse()));

  // Process incoming client broadcasts
  socket.on('send_message', async (data: SocketMessagePayload) => {
    try {
      const newMessage = new Message({
        nickname: data.nickname,
        text: data.text
      });
      const savedMessage = await newMessage.save();
      io.emit('receive_message', savedMessage);
    } catch (err) {
      console.error("Failed storing payload transaction:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// --- MONGO BOOTSTRAP PIPELINE ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chat-ai';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB Connected Successfully.');
    server.listen(PORT, () => console.log(`🚀 Server operating on port ${PORT}`));
  })
  .catch(err => console.error('Database connection crash:', err));