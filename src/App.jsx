// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import NewPost from './components/NewPost';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PostDetail from './components/PostDetail';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <Router>
  <Routes>
    {/* Dashboard */}
    <Route 
      path="/" 
      element={
        token ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Login onLoginSuccess={handleLoginSuccess} />
        )
      } 
    />

    {/* Post Detail */}
    <Route 
      path="/post/:id" 
      element={
        token ? <PostDetail /> : <Login onLoginSuccess={handleLoginSuccess} />
      } 
    />

    {/* ✅ New Post Route */}
    <Route 
      path="/new-post" 
      element={
        token ? <NewPost /> : <Login onLoginSuccess={handleLoginSuccess} />
      } 
    />
  </Routes>
</Router>
  );
}

export default App;