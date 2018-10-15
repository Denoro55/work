// index.js

import { ADD_POST, DELETE_POST, FETCH_POST } from './types';
import axios from 'axios';

const apiUrl = window.location.origin;

export const sendMessage = (socket,data,name) => {
    return (dispatch) => {
      socket.emit(name,data)   
    };
};

export const getMessage = (socket) => {
    return (dispatch) => {
        socket.on('message',res => {
            console.log(res)
            dispatch(addItem(res))
        })   
    };
};

export const getUser = (socket) => {
    return (dispatch) => {
        socket.on('users',res => {
          console.log(res)
            dispatch({type: res.type,users: res.users})
        })   
    };
};

export const addItem = (res) => ({
    type: "ADD_MESSAGE",
    message: res
})

export const exitSession = () => {
    return (dispatch) => {
    return axios.get(`${apiUrl}/exit`)
        .then(response => {
            dispatch({type: 'SESSION_NODE', cookie: response.data})
        })
        .catch(error => {
            throw(error);
        });
    };
};

export const fetchInfo = (name) => {
    return (dispatch) => {
    console.log(`${apiUrl}/userinfo/${name}`)
    return axios.get(`${apiUrl}/userinfo/${name}`)
        .then(response => {
            console.log(response)
            dispatch({type: 'USER_INFO', info: response.data})
            dispatch(fetchPosts(response.data.posts))
        })
        .catch(error => {
            throw(error);
        });
    };
};

export const createUser = ({name,password}) => {
    return (dispatch) => {
        return axios.post(`${apiUrl}/register`, {name,password})
        .then(response => {
            dispatch({type: 'REG_RESULT', obj: {value: 'Successfully', color: 'green'}})
        })
        .catch(error => {
            dispatch({type: 'REG_RESULT', obj: {value: 'Failed', color: 'red'}})
            throw(error);
        });
    };
};

export const uploadPhoto = ({file}) => {
    const formData = new FormData();
    formData.append('file',file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return (dispatch) => {

        return axios.post(`${apiUrl}/uploadavatar`,formData,config)
        .then(response => {
            dispatch({type: 'USER_INFO', info: response.data})
        })
        .catch(error => {
            console.log(response)
            throw(error);
        });
    };
};

export const loginUser = ({name,password}) => {
  console.log(apiUrl);
    return (dispatch) => {
        return axios.post(`${apiUrl}/login`, {name,password})
        .then(response => {
            console.log(response.data)
            let setColor = 'red';
            if (response.data.value!='Failed'){
                setColor = 'green';
            }
            dispatch({type: 'REG_RESULT', obj: {value: response.data.value , color: setColor}})
            dispatch({type: 'SESSION_NODE', cookie: response.data.session})
        })
        .catch(error => {
            dispatch({type: 'REG_RESULT', obj: {value: 'Failed', color: 'red'}})
            throw(error);
        });
    };
};

export const createPost = ({ title, body }) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/posts/add`, {title, body})
      .then(response => {
        dispatch(createPostSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const createPostSuccess =  (data) => {
  console.log(data)
  return {
    type: ADD_POST,
    payload: {
      _id: data._id,
      title: data.title,
      body: data.body
    }
  }
};

export const deletePostSuccess = id => {
  return {
    type: DELETE_POST,
    payload: {
      id
    }
  }
}

export const deletePost = id => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/posts/delete/${id}`)
      .then(response => {
        dispatch(deletePostSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const fetchPosts = (posts) => {
  return {
    type: FETCH_POST,
    posts
  }
};

export const fetchAllPosts = (id) => {
  console.log(`${apiUrl}/posts/${id}`)
  return (dispatch) => {
    return axios.get(`${apiUrl}/posts/${id}`)
      .then(response => {
        console.log()
        dispatch(fetchPosts(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

export const fetchSession = () => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/session`)
      .then(response => {
        dispatch({type: 'SESSION_NODE', cookie: response.data})
      })
      .catch(error => {
        throw(error);
      });
  };
};