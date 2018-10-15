import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import skills from './skills';
import names from './names';
import posts from './posts';
import reg from './reg';
import session from './session';
import info from './info';
import messages from './messages';
import users from './users';

export default combineReducers({
	routing: routerReducer,
	skills,
	names,
	posts,
	reg,
	session,
	info,
	messages,
	users
})