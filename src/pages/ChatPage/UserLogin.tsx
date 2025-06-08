import React, { useState } from 'react';
import './UserLogin.css';

interface UserLoginProps {
  onLogin: (userId: string) => void;
  loading: boolean;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLogin, loading }) => {
  const [userId, setUserId] = useState<string>('test-user-1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onLogin(userId.trim());
    }
  };

  const quickLogin = (id: string) => {
    setUserId(id);
    onLogin(id);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Aloha Chat</h1>
        <p>Enter your user ID to join the chat</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userId">User ID:</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" disabled={loading || !userId.trim()}>
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </form>

        <div className="quick-login">
          <p>Quick login for testing:</p>
          <div className="quick-login-buttons">
            <button 
              onClick={() => quickLogin('test-user-1')}
              disabled={loading}
              className="quick-btn"
            >
              User 1
            </button>
            <button 
              onClick={() => quickLogin('test-user-2')}
              disabled={loading}
              className="quick-btn"
            >
              User 2
            </button>
            <button 
              onClick={() => quickLogin('test-user-3')}
              disabled={loading}
              className="quick-btn"
            >
              User 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin; 