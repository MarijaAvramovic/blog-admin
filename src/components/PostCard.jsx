// src/components/PostCard.jsx
import { useNavigate } from 'react-router-dom';

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      
      <p className={`status ${post.published ? 'published' : 'draft'}`}>
        {post.published ? '✅ Published' : '🔒 Draft'}
      </p>

      <p>{post.content.substring(0, 140)}...</p>

      <button 
        onClick={() => navigate(`/post/${post.id}`)}
        className="manage-btn"
      >
        Manage Post
      </button>
    </div>
  );
}

export default PostCard;