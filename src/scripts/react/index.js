import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { syncHistoryWithStore } from 'react-router-redux';
import { Switch , HashRouter , Route, Router} from 'react-router-dom';
import { createHashHistory } from 'history';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import App from './components/App';
import Blog from './components/Blog';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Err from './components/Err';

// import { fetchAllPosts } from './actions/index';
import { fetchSession } from './actions/index';

import reducer from './reducers';

const store = createStore(reducer,composeWithDevTools(applyMiddleware(thunk)));
const history = syncHistoryWithStore(createHashHistory(),store);

// store.dispatch(fetchAllPosts());

// store.dispatch(fetchSession());

store.subscribe(()=>{
	console.log(store.getState());
})

ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={App}></Route>
                    <Route exact path="/blog" component={Blog}></Route>
                    <Route exact path="/login" component={Login}></Route>
                    <Route exact path="/register" component={Register}></Route>
                    <Route exact path="/chat" component={Chat}></Route>
                    <Route exact path="/user/:id" component={Profile}></Route>
                    <Route component={Err}></Route>
                </Switch>
            </div>
        </HashRouter>
    </Provider>,
	document.getElementById('root')
);