import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DummyBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [activeShareBlogId, setActiveShareBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blog/AllBlog');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/users/getData', {
        headers: {
          auth: token,
        },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(`http://localhost:5000/blog/LikeBlog/${blogId}`, null, {
        headers: {
          auth: token,
        },
      });

      const updatedBlogs = blogs.map((blog) =>
        blog._id === blogId ? { ...blog, likes: response.data.blog.likes } : blog
      );
      setBlogs(updatedBlogs);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleCommentToggle = (blogId) => {
    setActiveCommentBox(activeCommentBox === blogId ? null : blogId);
  };

  const handleCommentSubmit = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/blog/Comment/${blogId}`,
        { content: commentInput },
        {
          headers: {
            auth: token,
          },
        }
      );

      const updatedBlogs = blogs.map((blog) =>
        blog._id === blogId ? { ...blog, comments: [...(blog.comments || []), response.data.comment] } : blog
      );
      setBlogs(updatedBlogs);

      setCommentInput('');
      setActiveCommentBox(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShareBlog = (blogId) => {
    setActiveShareBlogId(blogId);
  };

  const shareOnPlatform = (platform, blogId) => {
    const blogUrl = `${window.location.origin}/blog/${blogId}`; // Replace with actual blog URL
    switch (platform) {
      case 'WhatsApp':
        window.open(`whatsapp://send?text=${encodeURIComponent(blogUrl)}`, '_blank');
        break;
      case 'Facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`, '_blank');
        break;
      case 'Twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}`, '_blank');
        break;
      default:
        break;
    }
    setActiveShareBlogId(null);
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 min-h-screen">
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white text-black p-4 my-4 rounded-lg shadow-lg h-full">
          <h2 className="text-xl font-bold mb-2">{blog.title}</h2>
          <p className="text-gray-600">{blog.content}</p>
          {blog.comments && blog.comments.length > 0 && (
            <div className="mt-4">
              {blog.comments.map((comment, index) => (
                <p key={index} className="text-gray-400">
                  <i className="ri-chat-3-line"></i> {comment.content}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-start mt-4">
            <button
              onClick={() => handleLike(blog._id)}
              className="text-gray-600 hover:text-black flex items-center"
            >
              {userData && blog.likes.includes(userData._id) ? (
                <i className="ri-heart-fill"></i>
              ) : (
                <i className="ri-heart-line"></i>
              )}
              Like
            </button>
            <button
              onClick={() => handleCommentToggle(blog._id)}
              className="text-gray-600 hover:text-black flex items-center ml-4"
            >
              <i className="ri-chat-3-line"></i>
              Comment
            </button>
            <button
              onClick={() => handleShareBlog(blog._id)}
              className="text-gray-600 hover:text-black flex items-center ml-4"
            >
              <i className="ri-share-forward-line"></i>
              Share
            </button>
          </div>

          {/* Share icons */}
          {activeShareBlogId === blog._id && (
            <div className="flex mt-2">
              <button
                onClick={() => shareOnPlatform('WhatsApp', blog._id)}
                className="text-gray-600 hover:text-black flex items-center"
              >
                <i class="ri-whatsapp-fill"></i> WhatsApp
              </button>
              <button
                onClick={() => shareOnPlatform('Facebook', blog._id)}
                className="text-gray-600 hover:text-black flex items-center ml-4"
              >
                <i class="ri-facebook-box-fill"></i> Facebook
              </button>
              <button
                onClick={() => shareOnPlatform('Twitter', blog._id)}
                className="text-gray-600 hover:text-black flex items-center ml-4"
              >
               <i class="ri-twitter-fill"></i> Twitter
              </button>
            </div>
          )}

          {/* Comment input box */}
          {activeCommentBox === blog._id && (
            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder="Write your comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              ></textarea>
              <button
                onClick={() => handleCommentSubmit(blog._id)}
                className="mt-2 bg-gray-700 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Send <i className="ri-send-plane-2-fill"></i>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DummyBlogList;
