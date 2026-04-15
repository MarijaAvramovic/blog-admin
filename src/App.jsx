import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'http://localhost:4100';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setPosts([]);
  };

  const loadPosts = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      loadPosts();
    }
  }, [token]);

  // Login Screen
  if (!token) {
    return (
      <div className="login-container">
        <h1>Admin Login</h1>
        <p>Only admins can access this area</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="app-container">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <h2>All Posts ({posts.length})</h2>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p className={`status ${post.published ? 'published' : 'draft'}`}>
              {post.published ? '✅ Published' : '🔒 Draft'}
            </p>
            <p>{post.content.substring(0, 140)}...</p>
          </div>
        ))}
      </div>

      {posts.length === 0 && <p>No posts found.</p>}
    </div>
  );
}

export default App;