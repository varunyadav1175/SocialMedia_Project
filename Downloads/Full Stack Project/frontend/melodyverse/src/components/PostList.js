import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './PostList.css';
import Toast from './toast'; // Import the Toast component

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false); // State for logout toast
  const observer = useRef();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:3000/api/auth/posts', config);
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!loading) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
      };
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }, options);
  
      if (observer.current) {
        observer.current.observe(document.getElementById('end-of-posts'));
      }
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setShowLogoutToast(true); // Show the logout toast
    setTimeout(() => {
      navigate('/'); // Redirect to login page after a delay
    }, 2000); // Adjust the delay as needed
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(0, indexOfLastPost);

  return (
    <div className="post-list-container">
      <h2 className="post-list-heading">Post List</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button> {/* Logout button */}
      {showLogoutToast && <Toast message="Logout successful!" />} {/* Logout toast */}
      <div className="post-list">
        {currentPosts.map((post, index) => (
          <div key={index} className="post-box">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-content">{post.content}</p>
            <div className="post-info">
              <p>Author: {post.author}</p>
              <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
        <div id="end-of-posts"></div>
      </div>
    </div>
  );
};

export default PostList;
