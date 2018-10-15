import React, { Component } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';

import { Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <div>
        <h1> Hello Blog </h1>
        <Link to="/">Back</Link>
          <div>
            <CreatePost />
          </div>
          <div>
            <PostList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;


// class App extends Component {
//   render() {
//     return (
//       <div>
//         <div>
//         <h1> Hello Blog </h1>
//           <div>
//             <CreatePost />
//           </div>
//           <div>
//             <PostList />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }