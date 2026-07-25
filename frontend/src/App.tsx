import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';

export default function App() {
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ border: '1px solid #ccc', padding: '30px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3>Enter Your Chat Room Name</h3>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Nickname..." 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Join Chat</button>
        </form>
      </div>
    );
  }

  return <ChatRoom nickname={username} />;
}