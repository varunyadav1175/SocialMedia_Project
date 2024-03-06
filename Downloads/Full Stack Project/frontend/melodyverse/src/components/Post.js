// Post.js

import React from 'react';

const Post = ({ post }) => {
  return (
    <div>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p>Author: {post.author}</p>
      <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
    </div>
  );
};

export default Post;
