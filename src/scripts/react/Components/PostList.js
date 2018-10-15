import React from 'react';
import { connect } from 'react-redux';

import Post from './Post';
import Masonry from 'react-masonry-component';

import { deletePost } from '../actions';

const masonryOptions = {
    itemSelector: '.post-wrapper',
    columnWidth: 250,
    gutter: 15,
    isFitWidth: true
};

function PostList({ posts, onDelete }) {
  if(!posts.length) {
    return (
      <div>
        No Posts
      </div>
    )
  }
  return (
    <div className="posts" >
      <div className="posts-title">Posts</div>
      <div className="posts-list">
        <Masonry
            className='PostsGrid'
            options={masonryOptions} >
            {posts.map(post => {
                return (<Post post={ post } onDelete={ onDelete } key={ post._id } />);})
            }
        </Masonry>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    posts: state.posts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDelete: id => {
      dispatch(deletePost(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostList);