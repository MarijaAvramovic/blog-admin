// src/components/Dashboard.jsx
function Dashboard({ posts, onLogout }) {
  return (
    <div className="app-container">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">
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

export default Dashboard;