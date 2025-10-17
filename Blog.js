import React from 'react';

const Blog = ({ blog }) => {
  return (
    <div className="blog">
      <div>{blog.title} {blog.author}</div>
      <div><a href={blog.url} target="_blank" rel="noreferrer">link</a></div>
    </div>
  );
};

export default Blog;
