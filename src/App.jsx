// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const API_BASE = 'http://localhost:4100';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [posts, setPosts] = useState([]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setPosts([]);
  };

  // Load posts when logged in
  useEffect(() => {
    if (!token) return;

    const loadPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts/admin`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts || []);
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      }
    };

    loadPosts();
  }, [token]);

  return (
    <>
      {!token ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard posts={posts} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;