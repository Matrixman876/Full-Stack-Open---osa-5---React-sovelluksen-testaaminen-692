import React, { useState, useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  // load blogs
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  // load logged in user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, type='success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      showNotification(`${user.name} logged in`, 'success');
    } catch (error) {
      showNotification('wrong username/password', 'error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
    showNotification('logged out', 'success');
  };

  const addBlog = async (blogObject) => {
    try {
      const created = await blogService.create(blogObject);
      setBlogs(blogs.concat(created));
      showNotification(`a new blog "${created.title}" by ${created.author} added`, 'success');
    } catch (error) {
      showNotification('failed to add blog', 'error');
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <div className="togglable">
        <BlogForm createBlog={addBlog} />
      </div>

      <div>
        {blogs.map(blog => 
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  );
};

export default App;
