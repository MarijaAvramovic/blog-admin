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

  // ✅ Fetch post safely
  useEffect(() => {
    if (!id || !token) return;

    const fetchPost = async () => {
      try {
        console.log("➡️ Fetching post:", id);

        const res = await fetch(`${API_BASE}/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Status:", res.status);

        const data = await res.json();
        console.log("Response:", data);

        if (!data.success || !data.post) {
          console.error("❌ Invalid response:", data);
          return;
        }

        const p = data.post;

        setPost(p);
        setTitle(p.title);
        setContent(p.content);
        setPublished(p.published);
        setComments(p.comments || []);
      } catch (err) {
        console.error("❌ Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  // ✅ Toggle publish
  const togglePublish = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      const data = await res.json();

      if (data.success) {
        setPublished(!published);
        alert(`Post is now ${!published ? 'Published' : 'Unpublished'}`);
      } else {
        alert('Failed to update publish status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating publish status');
    }
  };

  // ✅ Save title/content
  const saveChanges = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        alert('Post updated successfully!');
      } else {
        alert('Failed to update post');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving changes');
    }
  };

  // ✅ Delete comment
  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await fetch(`${API_BASE}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment');
    }
  };

  // ✅ Delete post (FIXED missing function)
  const deletePost = async () => {
    if (!window.confirm('Delete this post permanently?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Post deleted');
        navigate('/');
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    }
  };

  // ✅ UI states
  if (loading) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Loading post...</p>;
  }

  if (!post) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Post not found.</p>;
  }

  return (
    <div className="post-detail">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Dashboard
      </button>

      <h1>Edit Post</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="edit-input"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="edit-textarea"
        rows={12}
      />

      <div className="actions">
        <button onClick={saveChanges} className="save-btn">
          Save Changes
        </button>

        <button
          onClick={togglePublish}
          className={`publish-btn ${published ? 'unpublish' : 'publish'}`}
        >
          {published ? 'Unpublish' : 'Publish'}
        </button>

        <button onClick={deletePost} className="delete-post-btn">
          Delete Post
        </button>
      </div>

      <h2>Comments ({comments.length})</h2>

      <div className="comments-list">
        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <strong>
              {comment.author?.name || comment.author?.username}
            </strong>
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