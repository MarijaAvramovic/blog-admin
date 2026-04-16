// src/components/NewPost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://blog-api-wwtw.onrender.com';  

function NewPost() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('Post created successfully!');
        navigate('/');           // Go back to dashboard
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-post-container">
      <button onClick={() => navigate('/')} className="back-btn">← Back to Dashboard</button>

      <h1>Create New Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="edit-input"
          required
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          className="edit-textarea"
          rows={15}
          required
        />

        <div className="actions">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="cancel-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn" 
            disabled={loading}
          >
            {loading ? 'Creating Post...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewPost;