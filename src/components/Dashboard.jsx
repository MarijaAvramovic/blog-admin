// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';

 

function Dashboard({ onLogout }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching posts with token:", token.substring(0, 20) + "...");

        const res = await fetch('https://blog-api-wwtw.onrender.com/api/posts/admin', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log("Response status:", res.status);

        const data = await res.json();
        console.log("Full response from backend:", data);   // ← THIS IS THE IMPORTANT ONE

        if (data.success) {
          console.log(`Received ${data.posts?.length || 0} posts`);
          setPosts(data.posts || []);
        } else {
          console.error("Backend returned success: false", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [token]);

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Loading posts...</p>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Admin Dashboard</h1>
          <button onClick={() => navigate('/new-post')} className="create-btn">
      + New Post
    </button>
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