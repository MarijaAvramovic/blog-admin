// src/components/PostDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:4100';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('adminToken');

  // Load the post when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          const p = data.post;
          setPost(p);
          setTitle(p.title);
          setContent(p.content);
          setPublished(p.published);
          setComments(p.comments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Toggle Publish / Unpublish
  const togglePublish = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success) {
        setPublished(!published);
        alert(`Post is now ${!published ? 'Published' : 'Unpublished'}`);
      }
    } catch (err) {
      alert('Failed to toggle publish status');
    }
  };

  // Save changes to title and content
  const saveChanges = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      if (res.ok) {
        alert('Post updated successfully!');
      } else {
        alert('Failed to update post');
      }
    } catch (err) {
      alert('Error saving changes');
    }
  };

  // Delete a comment
  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== commentId));
      alert('Comment deleted');
    } catch (err) {
      alert('Failed to delete comment');
    }
  };


  const deletePost = async () => {
    if (!window.confirm('Delete this post?')) return;

    try {
    const res = await fetch(`${API_BASE}/api/posts/${id}`, {   // ← add "const res ="
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Post deleted successfully!');
        navigate('/');        // Go back to dashboard
      } else {
        const errorData = await res.json().catch(() => ({}));
      alert(`Failed to delete post: ${errorData.message || res.status}`);
      }
    }
       
      catch (err) {
      alert('Failed to delete post');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading post...</p>;
  if (!post) return <p style={{ textAlign: 'center', padding: '50px' }}>Post not found.</p>;

  return (
    <div className="post-detail">
      <button onClick={() => navigate('/')} className="back-btn">← Back to Dashboard</button>

      <h1>Edit Post</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="edit-input"
        placeholder="Post Title"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="edit-textarea"
        rows={12}
        placeholder="Post Content"
      />

      <div className="actions">
        <button onClick={saveChanges} className="save-btn">Save Changes</button>
     
        <button 
          onClick={togglePublish}
          className={`publish-btn ${published ? 'unpublish' : 'publish'}`}
        >
          {published ? 'Unpublish' : 'Publish Now'}
        </button>

   <button onClick={deletePost} className="delete-post-btn">DELETE POST</button>

      </div>

      <h2>Comments ({comments.length})</h2>
      
      <div className="comments-list">
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <strong>{comment.author?.name || comment.author?.username}</strong>
            <p>{comment.content}</p>
            <button 
              onClick={() => deleteComment(comment.id)} 
              className="delete-btn"
            >
              Delete Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;