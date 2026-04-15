// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import PostCard from './PostCard';

function Dashboard({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch('http://localhost:4100/api/posts/admin', {
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

    if (token) loadPosts();
  }, [token]);

  return (
    <div className="app-container">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <h2>All Posts ({posts.length})</h2>

      <div className="posts-grid">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && <p className="empty-state">No posts found.</p>}
    </div>
  );
}

export default Dashboard;