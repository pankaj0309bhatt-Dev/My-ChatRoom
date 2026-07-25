import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface ChatRoomProps {
  nickname: string;
}

interface MessageData {
  _id?: string;
  nickname: string;
  text: string;
  timestamp?: string;
}

export default function ChatRoom({ nickname }: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  
  // AI Utilities state blocks
  const [summary, setSummary] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResult, setSearchResult] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('chat_history', (history: MessageData[]) => {
      setMessages(history);
    });

    socketRef.current.on('receive_message', (message: MessageData) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      nickname: nickname,
      text: inputMessage
    });
    setInputMessage('');
  };

  const handleFetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.get('http://localhost:5000/api/ai/summary');
      setSummary(res.data.summary);
    } catch (err) {
      setSummary("Error retrieving workspace context summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSearchHistory = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoadingSearch(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/search', { query: searchQuery });
      setSearchResult(res.data.answer);
    } catch (err) {
      setSearchResult("Error computing semantic query request.");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* CHAT LOG SCREEN COMPONENT */}
      <div style={{ flex: 2, border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h3>Logged in as: <span style={{ color: '#007bff' }}>{nickname}</span></h3>
        <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
          {messages.map((msg, idx) => (
            <div key={msg._id || idx} style={{ marginBottom: '12px', padding: '6px 10px', borderRadius: '4px', background: msg.nickname === nickname ? '#e1f5fe' : '#f5f5f5' }}>
              <strong>{msg.nickname}:</strong> <span>{msg.text}</span>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..." 
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Send</button>
        </form>
      </div>

      {/* AI OPERATIONS WORKSPACE PANEL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h4>Chat Room Summary</h4>
          <button onClick={handleFetchSummary} disabled={loadingSummary} style={{ padding: '8px 12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loadingSummary ? 'Analyzing...' : 'Summarize Last 30 Messages'}
          </button>
          {summary && <p style={{ whiteSpace: 'pre-line', background: '#f8f9fa', padding: '10px', marginTop: '10px', borderRadius: '4px', fontSize: '14px' }}>{summary}</p>}
        </div>

        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
          <h4>Chat History Search</h4>
          <form onSubmit={handleSearchHistory} style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., who mentioned movie?"
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" disabled={loadingSearch} style={{ padding: '8px 12px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {loadingSearch ? 'Searching...' : 'Search'}
            </button>
          </form>
          {searchResult && <p style={{ whiteSpace: 'pre-line', background: '#f8f9fa', padding: '10px', borderRadius: '4px', fontSize: '14px' }}>{searchResult}</p>}
        </div>
      </div>
    </div>
  );
}