// Post.js

import React from 'react';

const styles = {
  borderBottom: '2px solid #eee',
  background: '#fafafa',
  borderRadius: '7px',
  padding: '20px',
  marginBottom: '40px'
};

export default ({ post: { title, body, _id }, onDelete }) => {
    return (
        <div className="post-wrapper">
            <div className="post-block">
              <div onClick={() => onDelete(_id)} className="remove-block"></div>
              <div className="post-title">{title}</div>
              <div className="post-text">{body}</div>
            </div>
        </div>
    );
};